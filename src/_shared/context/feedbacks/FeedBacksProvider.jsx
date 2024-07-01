import React, { createContext, useReducer, useContext } from 'react';
import AlertService from '../../services/feedbacks/AlertService';
import ConfirmDialogService from '../../services/feedbacks/ConfirmDialogService';
import DialogListLibrary from '../../../online/_shared/components/library/DialogListLibrary';
import PrintingModal from '../../../online/_shared/components/printing/PrintingModal';
import MessageNotificationModal from '../../../online/_shared/components/feedBacks/message-notifications/MessageNotificationModal';

const initializerArg = {
  confirmDialog: {
    isOpen: false,
    title: 'attention',
    subTitle: 'Voullez vous vraiment ?',
  },
  notifyAlert: {
    isOpen: false,
    message: 'je teste alert test',
    type: 'success',
  },
  dialogListLibrary: {
    isOpen: false,
    onClose: () => {},
    type: null,
    folderParent: null,
  },
  printingModal: { isOpen: false, onClose: () => {}, type: null, data: null },
  messageNotificationModal: { isOpen: false, onClose: () => {}, type: null, data: [] },
};

const FeedBacksContext = createContext(initializerArg);

const FeedBacksReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return {
        ...state,
        notifyAlert: action.payload.notifyAlert,
      };
    case 'CONFIRM':
      return {
        ...state,
        confirmDialog: action.payload.confirmDialog,
      };
    case 'DIALOG_LIST_LIBRARY':
      return {
        ...state,
        dialogListLibrary: action.payload.dialogListLibrary,
      };
    case 'PRINTING_MODAL':
      return {
        ...state,
        printingModal: action.payload.printingModal,
      };
    case 'MSG_NOTIFY':
      return {
        ...state,
        messageNotificationModal: action.payload.messageNotificationModal,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const FeedBacksProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FeedBacksReducer, initializerArg);
  const setNotifyAlert = (notifyAlert) => {
    dispatch({ type: 'NOTIFY', payload: { notifyAlert } });
  };

  const setConfirmDialog = (confirmDialog) => {
    dispatch({ type: 'CONFIRM', payload: { confirmDialog } });
  };

  const setDialogListLibrary = (dialogListLibrary) => {
    dispatch({ type: 'DIALOG_LIST_LIBRARY', payload: { dialogListLibrary } });
  };

  const setPrintingModal = (printingModal) => {
    dispatch({ type: 'PRINTING_MODAL', payload: { printingModal } });
  };

  const setMessageNotificationModal = (messageNotificationModal) => {
    dispatch({ type: 'MSG_NOTIFY', payload: { messageNotificationModal } });
  };
  return (
    <FeedBacksContext.Provider
      value={{
        setNotifyAlert,
        setConfirmDialog,
        setDialogListLibrary,
        setPrintingModal,
        setMessageNotificationModal,
      }}
    >
      {children}
      <AlertService notify={state?.notifyAlert} setNotify={setNotifyAlert} />
      <ConfirmDialogService
        confirmDialog={state?.confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <DialogListLibrary
        dialogListLibrary={state?.dialogListLibrary}
        setDialogListLibrary={setDialogListLibrary}
      />
      <PrintingModal
        printingModal={state?.printingModal}
        setPrintingModal={setPrintingModal}
      />
      <MessageNotificationModal
        messageNotificationModal={state?.messageNotificationModal}
        setMessageNotificationModal={setMessageNotificationModal}
      />
    </FeedBacksContext.Provider>
  );
};

export const useFeedBacks = () => useContext(FeedBacksContext);
