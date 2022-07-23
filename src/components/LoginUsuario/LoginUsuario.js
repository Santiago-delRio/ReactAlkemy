export const LoginUsuario = async (datos) => {

  const res = await fetch(`${process.env.REACT_APP_SERVER_IP}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: datos.userName,
      password: datos.password,
    }),
  });

  const data = await res.json();

  if (data.status_code === 200) {
    localStorage.setItem("token", data.result.token);
    localStorage.setItem("user", data.result.user.userName);
    localStorage.setItem("teamID", data.result.user.teamID);
    localStorage.setItem("role", data.result.user.role);
  }

  return data.status_code;
};
