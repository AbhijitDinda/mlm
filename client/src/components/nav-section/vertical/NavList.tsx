import { Collapse, List } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getActive } from "..";
import { NavItem, NavItemRoot, NavItemSub } from "./NavItem";

// ----------------------------------------------------------------------

export function NavListRoot({
  list,
  isCollapse,
}: {
  list: NavItem;
  isCollapse: boolean;
}) {
  const { pathname } = useLocation();
  const active = getActive(list.path, pathname);
  const [open, setOpen] = useState(active);
  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />

        {!isCollapse && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {(list.children || []).map((item) => (
                <NavListSub key={item.title} list={item} />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return <NavItemRoot item={list} active={active} isCollapse={isCollapse} />;
}

// ----------------------------------------------------------------------

function NavListSub({ list }: { list: NavItem }) {
  const { pathname } = useLocation();
  const active = getActive(list.path, pathname);
  const [open, setOpen] = useState(active);
  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemSub
          item={list}
          onOpen={() => setOpen(!open)}
          open={open}
          active={active}
        />

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map((item) => (
              <NavItemSub
                key={item.title}
                item={item}
                active={getActive(item.path, pathname)}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return <NavItemSub item={list} active={active} />;
}
