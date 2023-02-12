import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { EditorState } from "draft-js";
import { createContext, Dispatch, RefObject, SetStateAction, useMemo, useRef, useState } from "react";
import { PostDirection } from "../../enums";
import Editor from '@draft-js-plugins/editor';

export type AppContextState = {
  showLoginModal: boolean;
  setshowLoginModal: Dispatch<SetStateAction<boolean>>;

  showCreatePostModal: boolean;
  setShowCreatePostModal: Dispatch<SetStateAction<boolean>>;

  creationEntryId: string | null;
  setCreationEntryId: Dispatch<SetStateAction<string | null>>;

  creationDirection: PostDirection | null; 
  setCreationDirection: Dispatch<SetStateAction<PostDirection | null>>;

  connectionPostIds: string[];
  setConnectionPostIds: Dispatch<SetStateAction<string[]>>;

  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextState>({} as AppContextState);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLoginModal, setshowLoginModal] = useState(false);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [creationEntryId, setCreationEntryId] = useState<string | null>(null);

  const [creationDirection, setCreationDirection] = useState<PostDirection | null>(null);

  const [connectionPostIds, setConnectionPostIds] = useState<string[]>([]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const appContextValue = useMemo(() => ({
    showLoginModal,
    setshowLoginModal,
    showCreatePostModal,
    setShowCreatePostModal,
    creationEntryId,
    setCreationEntryId,
    creationDirection,
    setCreationDirection,
    connectionPostIds,
    setConnectionPostIds,
    isDarkMode,
    setIsDarkMode,
  }), [
    showLoginModal, 
    showCreatePostModal, 
    creationEntryId, 
    creationDirection,
    connectionPostIds, 
    isDarkMode
  ]);

  return (
    <IonApp>
      <IonReactRouter>
        <AppContext.Provider value={appContextValue}>
          {children}
        </AppContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
};

export { AppContext, AppProvider };