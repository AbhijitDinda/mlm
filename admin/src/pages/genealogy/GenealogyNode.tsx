import { getFileSrc, randomInt } from "../../utils/fns";

const GenealogyNode = ({
  data,
}: {
  data: { avatar?: string; userName: string; userId: number };
}) => {
  if (!data.avatar) {
    const id = randomInt(1, 202);
    data.avatar = `/public/avatars/avatar_${id}.jpg`;
  }
  data.avatar = getFileSrc(data.avatar);
  const { avatar, userName, userId } = data;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        width: 220,
        height: 140,
      }}
    >
      <div
        style={{
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          display: "inline-flex",
          width: 220,
          height: 140,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            zIndex: 9,
            border: `4px solid var(--neutral)`,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          {!avatar ? (
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontFamily: "Public Sans,sans-serif",
                fontSize: "1.25rem",
                lineHeight: 1,
                overflow: "hidden",
                userSelect: "none",
                fontWeight: 600,
                color: "#212B36",
                backgroundColor: "var(--primary)",
                borderRadius: "792px",
                width: "56px",
                height: "56px",
              }}
            >
              J
            </div>
          ) : (
            <img
              style={{
                textAlign: "center",
                objectFit: "cover",
                width: "56px",
                height: "56px",
              }}
              src={avatar}
              alt={userName}
            />
          )}
        </div>
        <div
          style={{
            boxShadow: "var(--box-shadow)",
            background: "var(--neutral)",
            transition: "var(--padding)",
            backgroundImage: "none",
            overflow: "hidden",
            position: "relative",
            zIndex: 0,
            borderRadius: "12px",
            textTransform: "capitalize",
            width: "100%",
            height: "100%",
            marginTop: "28px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              top: "0px",
              left: "0px",
              width: "100%",
              height: "4px",
              position: "absolute",
              borderRadius: "12px",
              backgroundColor: "var(--border-color)",
            }}
          ></div>
          <div
            style={{
              margin: "0px",
              lineHeight: 1.57143,
              fontSize: "0.875rem",
              fontFamily: "var(--font-family)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              color: "var(--border-color)",
              fontWeight: 400,
            }}
          >
            {userName}
          </div>
          <div
            style={{
              margin: "0px",
              lineHeight: 1.5,
              fontSize: "0.75rem",
              fontFamily: "var(--font-family)",
              fontWeight: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: "var(--color)",
              textAlign: "center",
            }}
          >
            {userId}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GenealogyNodeButton = ({ node }: { node: any }) => {
  return (
    <div style={{ width: "100%", color: "var(--border-color)" }}>
      <span style={{ fontSize: "9px" }}>
        {!node.children ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
              fill="var(--neutral)"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M256 176v160M336 256H176"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
              fill="var(--neutral)"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="32"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
              d="M336 256H176"
            />
          </svg>
        )}
      </span>
    </div>
  );
};

export default GenealogyNode;
