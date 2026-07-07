export default function UserAvatar({

                                       user,

                                       size = 46,

                                       showName = true

                                   }) {

    if (!user) return null;

    return (

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px"
            }}
        >

            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "#2563eb",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 700,
                    flexShrink: 0
                }}
            >

                {user.avatarUrl ? (

                    <img
                        src={`http://localhost:8080${user.avatarUrl}`}
                        alt="avatar"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />

                ) : (

                    <>
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                    </>

                )}

            </div>

            {showName && (

                <div>

                    <div
                        style={{
                            fontWeight: 600
                        }}
                    >
                        {user.firstName} {user.lastName}
                    </div>

                </div>

            )}

        </div>

    );

}