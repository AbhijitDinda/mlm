import { Autocomplete, Card } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography/Typography";
import { OrgChart } from "d3-org-chart";
import { useEffect, useState } from "react";
import Avatar from "../../components/Avatar";
import { RouterOutput } from "../../trpc";
import createAvatar from "../../utils/createAvatar";

type GenealogyUsers = RouterOutput["network"]["genealogy"];
type GenealogyUser = GenealogyUsers[number];

const SearchAutoComplete = ({
  chart,
  nodes,
}: {
  chart: OrgChart<any> | null;
  nodes: GenealogyUsers | undefined;
}) => {
  if (!nodes) nodes = [];
  const validNodes = nodes.filter((node) => node.isValid === true);
  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (
    event: React.SyntheticEvent<Element, Event>,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  const [value, setValue] = useState<GenealogyUser | null>(null);
  const handleChange = (event: any, newValue: GenealogyUser | null) => {
    if (newValue && chart) {
      const id = newValue.id;
      chart.clearHighlighting();
      chart.setHighlighted(id).render();
    }
    setValue(newValue);
  };

  useEffect(() => {
    if (!value) chart?.clearHighlighting?.();
  }, [value]);

  return (
    <Box
      sx={{
        m: 2,
        position: "absolute",
        textAlign: "right",
        width: 1,
        right: 0,
        maxWidth: 300,
        zIndex:2,
        background:"inherit"
      }}
    >
      <Autocomplete
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        sx={{ width: 300 }}
        options={validNodes}
        autoHighlight
        getOptionLabel={(option) => {
          return `${option.userName} ${option.userId}` ?? crypto.randomUUID();
        }}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
          >
            <Avatar
              loading="lazy"
              alt={option.userName}
              src={option.avatar}
              color={
                option.avatar ? "default" : createAvatar(option.userName).color
              }
              sx={{ borderRadius: 99, width: 48, height: 48, mr: 2 }}
            >
              {createAvatar(option.userName).name}
            </Avatar>
            <Stack sx={{ ml: 0.5 }}>
              <Typography> {option.userId}</Typography>
              <Typography> {option.userName}</Typography>
            </Stack>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            label="Search User..."
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />
    </Box>
  );
};

export default SearchAutoComplete;
