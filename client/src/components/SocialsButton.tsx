import { Button, IconButton, Link, Stack, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import IconifyIcons from "../IconifyIcons";
import { trpc } from "../trpc";
import Iconify from "./Iconify";

// ----------------------------------------------------------------------

interface Props {
  initialColor?: boolean;
  links?: Object;
  simple?: boolean;
  sx?: Object;
}

export default function SocialsButton({
  initialColor = false,
  simple = true,
  sx,
  ...other
}: Props) {
  const { data } = trpc.home.socialLinks.useQuery();
  const links = data! ?? {};

  const SOCIALS = [
    {
      name: "facebook",
      label: "FaceBook",
      socialColor: "#1877F2",
      path: links.facebook,
    },
    {
      name: "instagram",
      label: "Instagram",
      socialColor: "#E02D69",
      path: links.instagram,
    },
    {
      name: "linkedin",
      label: "Linkedin",
      socialColor: "#007EBB",
      path: links.linkedin,
    },
    {
      name: "twitter",
      label: "Twitter",
      socialColor: "#00AAEC",
      path: links.twitter,
    },
    {
      name: "telegram",
      label: "Telegram",
      socialColor: "#0088CC",
      path: links.telegram,
    },
    {
      name: "youtube",
      label: "Youtube",
      socialColor: "#FF0000",
      path: links.youtube,
    },
    {
      name: "discord",
      label: "Discord",
      socialColor: "#5865F2",
      path: links.discord,
    },
  ];

  const socialLinks = SOCIALS.filter((link) => !!link.path);

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {socialLinks.map((social) => {
        const { name, label, path, socialColor } = social;
        return simple ? (
          <Link key={name} href={path}>
            <Tooltip title={label} placement="top">
              <IconButton
                color="inherit"
                sx={{
                  ...(initialColor && {
                    color: socialColor,
                    "&:hover": {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify
                  color={socialColor}
                  icon={
                    IconifyIcons.social[
                      name as keyof typeof IconifyIcons.social
                    ]
                  }
                  sx={{ width: 24 }}
                />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            sx={{
              m: 0.5,
              flexShrink: 0,
              ...(initialColor && {
                color: socialColor,
                borderColor: socialColor,
                "&:hover": {
                  borderColor: socialColor,
                  bgcolor: alpha(socialColor, 0.08),
                },
              }),
              ...sx,
            }}
            {...other}
          >
            {label}
          </Button>
        );
      })}
    </Stack>
  );
}
