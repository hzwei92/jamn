import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { EditorState } from "draft-js";
import { createContext, Dispatch, SetStateAction, useMemo, useState } from "react";
import { PostDirection } from "../../enums";

export type AppContextState = {
  showLoginModal: boolean;
  setshowLoginModal: Dispatch<SetStateAction<boolean>>;

  showCreatePostModal: boolean;
  setShowCreatePostModal: Dispatch<SetStateAction<boolean>>;

  creationPostId: string | null;
  setCreationPostId: Dispatch<SetStateAction<string | null>>;

  creationDirection: PostDirection | null; 
  setCreationDirection: Dispatch<SetStateAction<PostDirection | null>>;

  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;

  connectionPostIds: string[];
  setConnectionPostIds: Dispatch<SetStateAction<string[]>>;

  isDarkMode: boolean;
  setIsDarkMode: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextState>({} as AppContextState);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLoginModal, setshowLoginModal] = useState(false);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const [creationPostId, setCreationPostId] = useState<string | null>(null);

  const [creationDirection, setCreationDirection] = useState<PostDirection | null>(null);

  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });

  const [connectionPostIds, setConnectionPostIds] = useState<string[]>([]);


  const [isDarkMode, setIsDarkMode] = useState(false);

  const appContextValue = useMemo(() => ({
    showLoginModal,
    setshowLoginModal,
    showCreatePostModal,
    setShowCreatePostModal,
    creationPostId,
    setCreationPostId,
    creationDirection,
    setCreationDirection,
    editorState,
    setEditorState,
    connectionPostIds,
    setConnectionPostIds,
    isDarkMode,
    setIsDarkMode,
  }), [showLoginModal, showCreatePostModal, creationPostId, creationDirection, editorState, connectionPostIds, isDarkMode]);

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