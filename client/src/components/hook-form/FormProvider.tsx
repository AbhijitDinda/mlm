import { FormProvider as Form } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit: () => void;
}

export default function FormProvider({ children, onSubmit, methods }: Props) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
