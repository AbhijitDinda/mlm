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
    }
  | {
      type: "UPDATE_AVATAR";
      payload: string;
    }
  | {
      type: "UPDATE_PLAN";
      payload: boolean;
    }
  | {
      type: "UPDATE_TWO_FA";
      payload: boolean;
    }
  | {
      type: "UPDATE_KYC";
      payload: "unverified" | "pending" | "approved" | "rejected";
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
    case "UPDATE_AVATAR": {
      const avatar = action.payload;
      return {
        ...state,
        user: {
          ...state.user!,
          avatar,
        },
      };
    }
    case "UPDATE_PLAN": {
      const isPremium = action.payload;
      return { ...state, user: { ...state.user!, isPremium } };
    }
    case "UPDATE_KYC": {
      const kyc = action.payload;
      return { ...state, user: { ...state.user!, kyc } };
    }
    case "UPDATE_TWO_FA": {
      const twoFA = action.payload;
      return { ...state, user: { ...state.user!, twoFA } };
    }
    default: {
      return state;
    }
  }
};

type AuthContext = {
  login: ({ accessToken, user }: { accessToken: string; user: User }) => void;
  logout: () => Promise<void>;
  updateAvatar: (data: string) => void;
  updateKyc: (data: "unverified" | "pending" | "approved" | "rejected") => void;
  updateUser: (user: User) => void;
  updatePlan: (data: boolean) => void;
  updateTwoFA: (data: boolean) => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
};
const initialContext: AuthContext = {
  ...initialState,
  login: ({ accessToken, user }: { accessToken: string; user: User }) => {},
  logout: async () => Promise.resolve(),
  updateAvatar: (data: string) => {},
  updateKyc: (data: "unverified" | "pending" | "approved" | "rejected") => {},
  updateUser: (user: User) => {},
  updatePlan: (data: boolean) => {},
  updateTwoFA: (data: boolean) => {},
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
  const updateUser = (user: User) => {
    dispatch({
      type: "INITIALIZE",
      payload: {
        isAuthenticated: true,
        user,
      },
    });
  };
  const updateAvatar = (avatar: string) => {
    dispatch({
      type: "UPDATE_AVATAR",
      payload: avatar,
    });
  };
  const updateKyc = (
    kycStatus: "unverified" | "pending" | "approved" | "rejected"
  ) => {
    dispatch({
      type: "UPDATE_KYC",
      payload: kycStatus,
    });
  };
  const updatePlan = (plan: boolean) => {
    dispatch({
      type: "UPDATE_PLAN",
      payload: plan,
    });
  };
  const updateTwoFA = (fa: boolean) => {
    dispatch({
      type: "UPDATE_TWO_FA",
      payload: fa,
    });
  };

  const logout = async () => {
    const token = getLoginToken(true);
    setSession();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        updateKyc,
        updateAvatar,
        updatePlan,
        updateTwoFA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
