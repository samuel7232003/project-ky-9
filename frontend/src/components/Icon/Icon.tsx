import React from 'react';
import {
  // Heroicons
  HomeIcon,
  UserIcon,
  Cog6ToothIcon as CogIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
  ArrowLeftOnRectangleIcon as LoginIcon,
  UserPlusIcon as UserAddIcon,
  EyeIcon,
  EyeSlashIcon as EyeOffIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  // Material Design Icons
  MdDashboard,
  MdNotifications,
  MdSecurity,
  MdLanguage,
  MdHelp,
  MdError,
  MdCheckCircle,
  MdCancel,
  MdAdd,
  MdEdit,
  MdDelete,
  MdSearch,
  MdFilterList,
  MdSort,
  MdRefresh,
  MdDownload,
  MdUpload,
  MdShare,
  MdContentCopy,
  MdSave,
  MdUndo,
  MdRedo,
  MdPrint,
  MdClose,
  MdMenu,
  MdArrowBack,
  MdArrowForward,
  MdArrowUpward,
  MdArrowDownward,
  MdExpandMore,
  MdExpandLess,
  MdChevronLeft,
  MdChevronRight,
  MdMoreVert,
  MdMoreHoriz,
  MdStar,
  MdStarBorder,
  MdFavorite,
  MdFavoriteBorder,
  MdThumbUp,
  MdThumbDown,
  MdBookmark,
  MdBookmarkBorder,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCalendarToday,
  MdAccessTime,
  MdAttachFile,
  MdImage,
  MdLink,
  MdAttachMoney,
  MdBarChart,
  MdTableChart,
  MdList,
  MdGridOn,
  MdVolumeUp,
  MdVolumeDown,
  MdVolumeOff,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCameraAlt,
  MdPhotoLibrary,
  MdPalette,
  MdBrush,
  MdCreate,
  MdEditNote,
  MdNote,
  MdRemove,
  MdAddCircle,
  MdRemoveCircle,
  MdCheckCircleOutline,
  MdInfoOutline,
  MdWarningAmber,
  MdErrorOutline,
  MdHelpOutline,
  MdQuestionMark,
  MdPlayCircle,
  MdPauseCircle,
  MdStop,
  MdSkipNext,
  MdSkipPrevious,
  MdFastForward,
  MdFastRewind,
  MdExpand,
  MdCompress,
} from 'react-icons/md';

// Icon mapping
const iconMap = {
  // Navigation
  home: HomeIcon,
  user: UserIcon,
  settings: CogIcon,
  logout: LogoutIcon,
  login: LoginIcon,
  register: UserAddIcon,
  dashboard: MdDashboard,
  
  // Actions
  search: MdSearch,
  filter: MdFilterList,
  sort: MdSort,
  refresh: MdRefresh,
  add: MdAdd,
  edit: MdEdit,
  delete: MdDelete,
  download: MdDownload,
  upload: MdUpload,
  share: MdShare,
  copy: MdContentCopy,
  save: MdSave,
  undo: MdUndo,
  redo: MdRedo,
  print: MdPrint,
  
  // UI Elements
  eye: EyeIcon,
  eyeOff: EyeOffIcon,
  check: CheckIcon,
  close: XIcon,
  warning: ExclamationIcon,
  info: InformationCircleIcon,
  menu: MdMenu,
  times: MdClose,
  
  // Arrows
  chevronLeft: MdChevronLeft,
  chevronRight: MdChevronRight,
  arrowLeft: MdArrowBack,
  arrowRight: MdArrowForward,
  arrowUp: MdArrowUpward,
  arrowDown: MdArrowDownward,
  expandMore: MdExpandMore,
  expandLess: MdExpandLess,
  
  // Status
  success: MdCheckCircle,
  error: MdError,
  cancel: MdCancel,
  
  // Features
  notifications: MdNotifications,
  security: MdSecurity,
  language: MdLanguage,
  help: MdHelp,
  
  // Data
  lock: MdSecurity,
  email: MdEmail,
  phone: MdPhone,
  location: MdLocationOn,
  calendar: MdCalendarToday,
  clock: MdAccessTime,
  file: MdAttachFile,
  image: MdImage,
  link: MdLink,
  money: MdAttachMoney,
  chart: MdBarChart,
  table: MdTableChart,
  list: MdList,
  grid: MdGridOn,
  
  // Feedback
  thumbsUp: MdThumbUp,
  thumbsDown: MdThumbDown,
  heart: MdFavorite,
  star: MdStar,
  bookmark: MdBookmark,
  
  // Media
  volumeUp: MdVolumeUp,
  volumeDown: MdVolumeDown,
  volumeOff: MdVolumeOff,
  microphone: MdMic,
  microphoneOff: MdMicOff,
  video: MdVideocam,
  videoOff: MdVideocamOff,
  camera: MdCameraAlt,
  images: MdPhotoLibrary,
  
  // Design
  palette: MdPalette,
  brush: MdBrush,
  create: MdCreate,
  editNote: MdEditNote,
  note: MdNote,
  
  // Math
  minus: MdRemove,
  plus: MdAdd,
  addCircle: MdAddCircle,
  removeCircle: MdRemoveCircle,
  
  // Shapes
  checkCircle: MdCheckCircle,
  checkCircleOutline: MdCheckCircleOutline,
  infoOutline: MdInfoOutline,
  warningAmber: MdWarningAmber,
  errorOutline: MdErrorOutline,
  helpOutline: MdHelpOutline,
  questionMark: MdQuestionMark,
  
  // Controls
  playCircle: MdPlayCircle,
  pauseCircle: MdPauseCircle,
  stop: MdStop,
  skipNext: MdSkipNext,
  skipPrevious: MdSkipPrevious,
  fastForward: MdFastForward,
  fastRewind: MdFastRewind,
  expand: MdExpand,
  compress: MdCompress,
  
  // More
  moreVert: MdMoreVert,
  moreHoriz: MdMoreHoriz,
  starBorder: MdStarBorder,
  favoriteBorder: MdFavoriteBorder,
  bookmarkBorder: MdBookmarkBorder,
};

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  className = '',
  color,
  onClick,
  style,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  // Type assertion để đảm bảo IconComponent là một React component
  const Component = IconComponent as React.ComponentType<any>;
  
  // Xử lý size cho các thư viện icon khác nhau
  const iconProps: any = {
    className,
    color,
    onClick,
    style,
  };
  
  // Heroicons sử dụng width và height thay vì size
  if (name === 'home' || name === 'user' || name === 'settings' || 
      name === 'logout' || name === 'login' || name === 'register' ||
      name === 'eye' || name === 'eyeOff' || name === 'check' || 
      name === 'close' || name === 'warning' || name === 'info') {
    iconProps.width = size;
    iconProps.height = size;
  } else {
    // Material Design Icons sử dụng size
    iconProps.size = size;
  }
  
  return <Component {...iconProps} />;
};

export default Icon;
