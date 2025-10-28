import css from "./KnowledgeLib.module.css";
import information_circle from "../../../assets/images/information-circle-contained.png";
import select_img from "../../../assets/images/select-img.png";
import send from "../../../assets/images/send-01.png";

function KnowledgeLib() {
  return (
    <div className={css.container}>
      <div className={css.chatbox}>
        <div className={css.chatbotTitle}>
          <div className={css.title}>
            <p>Trò chuyện với hệ thống tri thức</p>
            <figure><img src={information_circle} alt="" /></figure>
          </div>
          <p className={css.newChat}>Trò chuyện mới</p>
        </div>
        <div className={css.chatArea}>
          {/* <p style={{fontSize: "100px"}}>Hello chị Trang và anh Thành nhé!</p> */}
        </div>
        <div className={css.inputArea}>
          <figure><img src={select_img} alt="" /></figure>
          <div className={css.inputText}>
            <input type="text" placeholder="Nhập câu hỏi bất kì về cây trồng..." />
            <figure><img src={send} alt="" /></figure>
          </div>
        </div>
      </div>
      <div className={css.history}>
        <p className={css.historyTitle}>Lịch sử trò chuyện</p>
        <div className={css.historyList}>
        </div>
      </div>
    </div>
  );
}
export default KnowledgeLib;