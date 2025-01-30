import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  Grid,
  LinearProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { matchIsValidTel } from "mui-tel-input";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import FormProvider from "../../components/hook-form/FormProvider";
import RHFTelInput from "../../components/hook-form/RHFTelInput";
import RHFTextField from "../../components/hook-form/RHFTextField";
import Iconify from "../../components/Iconify";
import SocialsButton from "../../components/SocialsButton";
import TitleText from "../../components/TitleText";
import { trpc } from "../../trpc";

const LeftCard = styled(Box)(({ theme }) => ({
  background: "#3E1F92",
  height: "100%",
  borderRadius: theme.spacing(2),
  padding: 40,
  color: "#fff",
  position: "relative",
  overflow: "hidden",
}));

const RightCard = styled(Box)(({ theme }) => ({
  height: "100%",
  padding: 40,
  display: "grid",
  placeItems: "center",
}));

const LeftBottomRightCard = styled(Box)(({ theme }) => ({
  width: 250,
  height: 250,
  borderRadius: 999,
  background: "#FA949D",
  marginLeft: "auto",
  position: "absolute",
  right: -100,
  bottom: -100,
}));

const LeftCircleCard = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: 999,
  background: "#8758FA",
  opacity: 0.9,
  marginTop: -20,
}));

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const ContactUs = () => {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { contactUs } = data! ?? {};
  const { title, subtitle, whatsapp, email, location } = contactUs ?? {};

  const defaultValues: FormValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  const isValidPhoneNumber = (value: string) => {
    const isValid = matchIsValidTel(value);
    return isValid;
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email"),
    phone: yup
      .string()
      .required("Contact Number is required")
      .test("Phone", "Contact Number is not valid", isValidPhoneNumber),
    message: yup.string().required("Message is required"),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const { handleSubmit, reset } = methods;

  //
  const { mutate, isLoading: isSubmitting } = trpc.home.contact.useMutation({
    onSuccess() {
      reset();
    },
  });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <>
      <Typography variant="h2" textAlign={"center"} mb={8}>
        Contact Us
      </Typography>
      <Card>
        {isLoading && <LinearProgress />}
        <Grid container>
          <Grid item xs={12} md={5}>
            <LeftCard>
              <Typography variant="h4" marginBottom={1}>
                <TitleText text={title} />
              </Typography>
              <Typography sx={{ color: "#A4A2BC" }}>
                <TitleText text={subtitle} />
              </Typography>

              <Stack marginTop={8} spacing={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Iconify
                    color="#FA949D"
                    sx={{ fontSize: 26 }}
                    icon={"ri:whatsapp-fill"}
                  />
                  <Typography>{whatsapp}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Iconify
                    color="#FA949D"
                    sx={{ fontSize: 26 }}
                    icon={"ic:round-email"}
                  />
                  <Typography>{email}</Typography>
                </Box>
                {location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Iconify
                      color="#FA949D"
                      sx={{ fontSize: 26 }}
                      icon={"material-symbols:location-on"}
                    />
                    <Typography>{location}</Typography>
                  </Box>
                )}
              </Stack>
              <Box
                sx={{ display: "flex", alignItems: "flex-end", height: 150 }}
              >
                <Box>
                  <SocialsButton />
                </Box>
                <LeftBottomRightCard>
                  <LeftCircleCard />
                </LeftBottomRightCard>
              </Box>
            </LeftCard>
          </Grid>
          <Grid item xs={12} md={7}>
            <RightCard>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5}>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="firstName"
                      label="First Name"
                      placeholder="Jamsr"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="lastName"
                      label="Last Name"
                      placeholder="World"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTextField
                      name="email"
                      label="Email"
                      placeholder="contact@email.com"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFTelInput
                      name="phone"
                      label="Contact Number"
                      placeholder="+ (91) 9771 7018 93"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      multiline
                      minRows={3}
                      name="message"
                      label="Message"
                      placeholder="Write your message.."
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} display="flex">
                    <LoadingButton
                      loading={isSubmitting}
                      type="submit"
                      sx={{ marginLeft: "auto" }}
                      variant="contained"
                      size="large"
                    >
                      Send Message
                    </LoadingButton>
                  </Grid>
                </Grid>
              </FormProvider>
            </RightCard>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default ContactUs;
