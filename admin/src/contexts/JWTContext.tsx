import { createContext, Reducer, useEffect, useReducer } from "react";
import { RouterOutput, trpc } from "../trpc";
import { getLoginToken, isValidToken, setSession } from "../utils/jwt";

// ----------------------------------------------------------------------

export type User = RouterOutput["profile"]["user"];

interface State {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: null | User;
}

type Action =
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: null | User };
    }
  | {
      type: "LOGIN";
      payload: { user: User };
    }
  | {
      type: "LOGOUT";
    };

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INITIALIZE": {
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isAuthenticated,
        isInitialized: true,
        user,
      };
    }
    case "LOGIN": {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case "LOGOUT": {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    }
    default: {
      return state;
    }
  }
};

type AuthContext = {
  login: ({ accessToken, user }: { accessToken: string; user: User }) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
};
const initialContext: AuthContext = {
  ...initialState,
  login: ({ accessToken, user }: { accessToken: string; user: User }) => {},
  logout: async () => Promise.resolve(),
};
const AuthContext = createContext<AuthContext>(initialContext);

// ----------------------------------------------------------------------

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState
  );

  const accessToken = getLoginToken();
  if (!isValidToken(accessToken)) {
    setSession();
  }

  const { mutate } = trpc.profile.user.useMutation({
    onSuccess(data) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: true,
          user: data,
        },
      });
    },
    onError() {
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    },
  });

  useEffect(() => {
    accessToken
      ? mutate()
      : dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
  }, []);

  const login = ({
    accessToken,
    user,
  }: {
    accessToken: string;
    user: User;
  }) => {
    setSession(accessToken);
    dispatch({
      type: "LOGIN",
      payload: {
        user,
      },
    });
  };
  const updateUser = (user: null) => {
    dispatch({
      type: "INITIALIZE",
      payload: {
        isAuthenticated: true,
        user,
      },
    });
  };

  const logout = async () => {
    const token = getLoginToken();
    setSession();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
