import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import MainRegistrationCard from "./MainRegistrationCard";
import { RegisterFormValues } from "./RegisterForm";
import RegisterVerifyOtp, { RegisterOtpFormValues } from "./RegisterVerifyOtp";

type RegisterFormValuesWithOtp = RegisterFormValues & RegisterOtpFormValues;

interface ContextProps {
  step: number;
  registerData: RegisterFormValues;
  onSuccess: (data: RegisterFormValues) => void;
  onGoBack: () => void;
  register: (data: RegisterFormValues | RegisterFormValuesWithOtp) => void;
  isLoading: boolean;
}

const defaultContext: ContextProps = {
  step: 1,
  registerData: {} as RegisterFormValues,
  onSuccess: () => {},
  onGoBack: () => {},
  register: (data: RegisterFormValues | RegisterFormValuesWithOtp) => {},
  isLoading: false,
};

export const RegisterContext = createContext(defaultContext);
export const RegisterProvider = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState<RegisterFormValues>(
    {} as RegisterFormValues
  );
  const onSuccess = (data: RegisterFormValues) => {
    setRegisterData(data);
    setStep(2);
  };
  const onGoBack = () => setStep(1);

  const { mutate: register, isLoading } = trpc.auth.register.useMutation({
    onSuccess(data, variables) {
      if (step === 1) {
        onSuccess(variables);
      } else {
        if ("userId" in data)
          navigate(APP_PATH.registrationSuccess(data.userId));
      }
    },
  });

  return (
    <RegisterContext.Provider
      value={{ onSuccess, onGoBack, register, step, registerData, isLoading }}
    >
      {step === 1 ? <MainRegistrationCard /> : <RegisterVerifyOtp />}
    </RegisterContext.Provider>
  );
};
