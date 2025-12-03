import React, { useState, useEffect } from 'react';
import css from "./KnowledgeLib.module.css";
import information_circle from "../../../assets/images/information-circle-contained.png";
import select_img from "../../../assets/images/select-img.png";
import send from "../../../assets/images/send-01.png";
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  loadConversations, 
  createConversation,
  loadMessages, 
  sendMessage, 
  setCurrentConversationId,
  clearMessages, 
  clearError,
  updateConversationTitle,
} from './KnowledgeLib.duck';

const KnowledgeLib: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    messages, 
    conversations, 
    currentConversationId,
    loading, 
    loadingMessages, 
    loadingConversations,
    error 
  } = useAppSelector((state) => state.knowledgeLib);
  
  const [content, setContent] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isCreatingConversation, setIsCreatingConversation] = useState<boolean>(false);
  const [editingConversationId, setEditingConversationId] = useState<string | null>(null);
  const [editingConversationTitle, setEditingConversationTitle] = useState<string>('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        setFileError('Vui lòng chọn file ảnh');
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }

      // Kiểm tra file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('Kích thước file không được vượt quá 10MB');
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }

      setSelectedFile(file);
      setFileError('');
      dispatch(clearError());
      
      // Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setFileError('');
  };

  const handleSend = async () => {
    // Validate
    if (!content.trim() && !selectedFile) {
      return;
    }

    // Tránh gửi nhiều lần cùng lúc
    if (loading || isCreatingConversation) {
      return;
    }

    dispatch(clearError());

    // Nếu chưa có conversation, tạo conversation mới trước
    let conversationId = currentConversationId;
    if (!conversationId) {
      // Tránh tạo duplicate - set flag trước khi tạo
      setIsCreatingConversation(true);
      try {
        const createResult = await dispatch(createConversation('Trò chuyện mới'));
        if (createConversation.fulfilled.match(createResult)) {
          conversationId = createResult.payload._id;
          // Đợi một chút để Redux state update
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          setIsCreatingConversation(false);
          return; // Không tạo được conversation thì dừng
        }
      } finally {
        setIsCreatingConversation(false);
      }
    }

    // Gửi tin nhắn
    const result = await dispatch(sendMessage({
      conversationId: conversationId!,
      content: content.trim(),
      file: selectedFile || undefined,
      uploadOptions: {
        folder: 'messages',
        transformation: {
          quality: 'auto',
          format: 'auto',
        },
      },
    }));

    // Nếu gửi thành công, reset form
    if (sendMessage.fulfilled.match(result)) {
      setContent('');
      setSelectedFile(null);
      setPreviewUrl('');
      setFileError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
    dispatch(clearMessages());
    setContent('');
    setSelectedFile(null);
    setPreviewUrl('');
    setFileError('');
    dispatch(clearError());
    
    // Tạo conversation mới
    await dispatch(createConversation('Trò chuyện mới'));
  };

  const handleConversationClick = (conversationId: string) => {
    // Chỉ thay đổi nếu click vào conversation khác với conversation hiện tại
    if (conversationId !== currentConversationId) {
      dispatch(setCurrentConversationId(conversationId));
    }
  };

  const handleStartEditConversationTitle = (conversationId: string, currentTitle: string) => {
    setEditingConversationId(conversationId);
    setEditingConversationTitle(currentTitle);
  };

  const handleChangeConversationTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingConversationTitle(e.target.value);
  };

  const handleSaveConversationTitle = async () => {
    if (!editingConversationId) {
      return;
    }

    const trimmedTitle = editingConversationTitle.trim();
    if (!trimmedTitle) {
      setEditingConversationId(null);
      return;
    }

    const conversation = conversations.find(
      (conv) => conv._id === editingConversationId
    );

    if (!conversation || conversation.title === trimmedTitle) {
      setEditingConversationId(null);
      return;
    }

    await dispatch(
      updateConversationTitle({
        id: editingConversationId,
        title: trimmedTitle,
      })
    );

    setEditingConversationId(null);
  };

  const handleEditTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveConversationTitle();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setEditingConversationId(null);
    }
  };

  const handleEditTitleBlur = () => {
    // Khi click ra ngoài thì thoát chế độ edit mà không lưu (chỉ Enter mới lưu)
    setEditingConversationId(null);
  };

  // Load conversations khi mount
  useEffect(() => {
    dispatch(loadConversations({}));
  }, [dispatch]);

  // Load messages khi currentConversationId thay đổi
  useEffect(() => {
    if (currentConversationId) {
      dispatch(loadMessages(currentConversationId));
    } else {
      // Nếu không có conversationId, clear messages và set loading = false
      dispatch(clearMessages());
    }
  }, [dispatch, currentConversationId]);

  return (
    <div className={css.container}>
      <div className={css.chatbox}>
        <div className={css.chatbotTitle}>
          <div className={css.title}>
            <p>Trò chuyện với hệ thống tri thức</p>
            <figure><img src={information_circle} alt="" /></figure>
          </div>
          <p className={css.newChat} onClick={handleNewChat} style={{ cursor: 'pointer' }}>
            Trò chuyện mới
          </p>
        </div>
        <div className={css.chatArea}>
          {loadingMessages && currentConversationId ? (
            <div className={css.emptyState}>
              <div className={css.loadingSpinnerLarge}></div>
              <p>Đang tải tin nhắn...</p>
            </div>
          ) : !currentConversationId ? (
            <div className={css.emptyState}>
              <p>Chưa có cuộc trò chuyện nào</p>
              <p className={css.emptyHint}>
                Nhấn "Trò chuyện mới" để bắt đầu cuộc trò chuyện
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className={css.emptyState}>
              <p>Chưa có tin nhắn nào</p>
              <p className={css.emptyHint}>
                Nhập nội dung và/hoặc chọn ảnh để gửi tin nhắn
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className={css.messageItem}>
                <div className={css.messageHeader}>
                  <span className={css.messageUser}>
                    {msg.userId?.name || msg.userId?.username || 'Unknown'}
                  </span>
                  <span className={css.messageTime}>
                    {new Date(msg.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                {msg.content && (
                  <div className={css.messageContent}>{msg.content}</div>
                )}
                {msg.image && (
                  <div className={css.messageImage}>
                    <img src={msg.image} alt="Uploaded" />
                  </div>
                )}
                <div className={css.messageStatus}>
                  Status: <span className={css.statusBadge}>{msg.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={css.inputArea}>
          {(error || fileError) && (
            <div className={css.errorMessage}>{error || fileError}</div>
          )}
          
          {previewUrl && (
            <div className={css.previewContainer}>
              <img src={previewUrl} alt="Preview" />
              <button
                type="button"
                className={css.removeButton}
                onClick={handleRemoveImage}
                aria-label="Remove image"
                tabIndex={0}
              >
                ×
              </button>
            </div>
          )}

          <div className={css.inputAreaWrapper}>
            <label className={css.fileInputLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={css.fileInput}
                disabled={loading}
              />
              <figure>
                <img src={select_img} alt="Select" />
              </figure>
            </label>

            <div className={css.inputText}>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi bất kì về cây trồng..."
                disabled={loading}
              />
              <figure 
                onClick={handleSend}
                style={{ cursor: loading || (!content.trim() && !selectedFile) ? 'not-allowed' : 'pointer' }}
              >
                {loading ? (
                  <div className={css.loadingSpinner}></div>
                ) : (
                  <img src={send} alt="Send" />
                )}
              </figure>
            </div>
          </div>
        </div>
      </div>
      <div className={css.history}>
        <p className={css.historyTitle}>Lịch sử trò chuyện</p>
        <div className={css.historyList}>
          {loadingConversations ? (
            <div className={css.loadingState}>
              <div className={css.loadingSpinnerSmall}></div>
              <p>Đang tải...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className={css.emptyHistory}>
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`${css.historyItem} ${
                  currentConversationId === conversation._id ? css.active : ''
                }`}
                onClick={() => handleConversationClick(conversation._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleConversationClick(conversation._id);
                  }
                }}
              >
                {editingConversationId === conversation._id ? (
                  <input
                    type="text"
                    className={css.historyItemTitleInput}
                    value={editingConversationTitle}
                    onChange={handleChangeConversationTitle}
                    onKeyDown={handleEditTitleKeyDown}
                    onBlur={handleEditTitleBlur}
                    autoFocus
                    aria-label="Chỉnh sửa tiêu đề cuộc trò chuyện"
                  />
                ) : (
                  <p
                    className={css.historyItemTitle}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditConversationTitle(
                        conversation._id,
                        conversation.title
                      );
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Chỉnh sửa tiêu đề cuộc trò chuyện"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStartEditConversationTitle(
                          conversation._id,
                          conversation.title
                        );
                      }
                    }}
                  >
                    {conversation.title}
                  </p>
                )}
                <p className={css.historyItemTime}>
                  {new Date(conversation.lastMessageAt).toLocaleString('vi-VN')}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeLib;