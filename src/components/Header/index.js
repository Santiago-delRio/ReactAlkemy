import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("User");
  const [tareasCreadas, setTareasCreadas] = useState(0);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("teamID");
    localStorage.removeItem("role");

    navigate("/", { replace: true });
  };
  // Fetch cantidad de tareas creadas
  const { tareas } = useSelector((state) => {
    return state.tareasReducer;
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_IP}/task/me`, {
      headers: {
        "Content-Type": "json/application",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTareasCreadas(data.result.length);
      });
  }, [tareas]);

  // Bloquear scroll cuando el menu esta abierto
  useEffect(() => {
    menuAbierto
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "inherit");
  }, [menuAbierto]);

  // Conseguir el nombre del usuario
  useEffect(() => {
    let usuario = localStorage.getItem("user");

    if (usuario.length > 20) usuario = `${usuario.slice(0, 20)}...`;

    setNombreUsuario(usuario);
  }, []);

  return (
    <header className="flex justify-between bg-white sm:flex-col p-6 sm:h-screen sm:justify-start border-r border-[#eeee] sm:p-0 sm:shrink-0">
      {/* Esconder el fondo cuando el menu esta abierto */}
      <div
        onClick={() => {
          if (menuAbierto) setMenuAbierto(!menuAbierto);
        }}
        className={`
            fixed z-10 sm:hidden w-screen h-screen top-0 left-0 bg-black transition-[opacity,visibility] transition- ease-in-out duration-[400ms]
            ${menuAbierto ? "opacity-30" : "opacity-0 invisible"}
        `}
      ></div>
      {/* Logo */}
      <img
        className="object-contain max-w-[100px] sm:ml-5 sm:py-5"
        src={logo}
        alt="Logo de GoScrum"
      />
      {/* Links */}
      <nav>
        {/* Boton abrir menu celular */}
        <button
          onClick={() => {
            setMenuAbierto(!menuAbierto);
          }}
          className="w-10 flex flex-col items-end sm:hidden"
        >
          <span className="block bg-negro w-full h-1 mb-1"></span>
          <span className="block bg-negro w-1/2 h-1 mb-1"></span>
          <span className="block bg-negro w-3/5 h-1"></span>
        </button>
        {/* Links celular */}
        <ul
          className={`
            fixed z-20 sm:hidden w-full left-0 top-0 bg-white p-4 before:absolute before:content[''] before:w-full before:h-1 before:top-0 before:left-0 before:bg-naranjaPrincipal
            ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[400ms]
            ${
              menuAbierto
                ? "translate-y-[0] visible"
                : "translate-y-[-100%] invisible"
            }
            `}
        >
          {/* Usuario */}
          <li className="flex justify-between pt-2 pb-5 border-b border-[E7E7E7] overflow-hidden">
            <div
              className={`
                flex max-w-[85%] ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[300ms]
                ${
                  menuAbierto
                    ? "translate-y-0 opacity-100 delay-[250ms]"
                    : "translate-y-[-70px] opacity-0"
                }
              `}
            >
              <svg
                className="fill-naranjaPrincipal shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
              </svg>
              <span className="ml-4 truncate">{localStorage.getItem("user")}</span>
            </div>
            {/* cerrar menu */}
            <button
              className="flex"
              onClick={() => {
                setMenuAbierto(!menuAbierto);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
              </svg>
            </button>
          </li>
          {/* Tareas creadas */}
          <li className="flex py-5 border-b border-[E7E7E7] overflow-hidden">
            <svg
              className={`
                    fill-naranjaPrincipal flex ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[300ms] 
                    ${
                      menuAbierto
                        ? "translate-y-0 opacity-100 delay-[300ms]"
                        : "translate-y-[-75px] opacity-0"
                    }
                `}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14H5v-2h6v2zm8-4H5v-2h14v2zm0-4H5V7h14v2z"></path>
            </svg>
            <span
              className={`
                 ml-4 flex ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[300ms]
                    ${
                      menuAbierto
                        ? "translate-y-0 opacity-100 delay-[300ms]"
                        : "translate-y-[-70px] opacity-0"
                    }
                `}
            >
              Tareas creadas: {tareasCreadas}
            </span>
          </li>
          {/* Cerrar sesion */}
          <li className="py-5 border-b border-[E7E7E7] overflow-hidden">
            <button
              className={`
                flex ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[300ms]
                    ${
                      menuAbierto
                        ? "translate-y-0 opacity-100 delay-[350ms]"
                        : "translate-y-[-70px] opacity-0"
                    }
                `}
              onClick={cerrarSesion}
            >
              <svg
                className="fill-naranjaPrincipal"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="5 5 14 14"
              >
                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
              </svg>
              <span className="ml-4">Cerrar sesión</span>
            </button>
          </li>
          {/* Donar */}
          <li className="pt-5 pb-1 overflow-hidden">
            <button
              className={`
                flex ease-[cubic-bezier(0.25, 0.8, 0.25, 1)] duration-[300ms]
                    ${
                      menuAbierto
                        ? "translate-y-0 opacity-100 delay-[400ms]"
                        : "translate-y-[-60px] opacity-0"
                    }
                `}
            >
              <svg
                className="fill-naranjaPrincipal"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z"></path>
              </svg>
              <span className="ml-4">Donar</span>
            </button>
          </li>
        </ul>
        {/* Links escritorio */}
        <ul className="hidden sm:block">
          {/* Usuario */}
          <li className="flex py-4 px-5 border-y border-[#eeee] items-center text-negro">
            <span className="text-base text-white w-[24px] h-[24px] flex items-center justify-center leading-[1] mr-3 rounded-[5px] bg-naranjaPrincipal">
              {nombreUsuario.slice(0, 1)}
            </span>
            <span title={localStorage.getItem("user")} className="text-lg">
              {nombreUsuario}
            </span>
          </li>
          {/* Tareas creadas */}
          <li className="flex items-center mt-4 mx-5 text-negro">
            <svg
              className="fill-naranjaPrincipal mr-3"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14H5v-2h6v2zm8-4H5v-2h14v2zm0-4H5V7h14v2z"></path>
            </svg>
            <span className=" text-base">Tareas creadas: {tareasCreadas}</span>
          </li>
          {/* Cerrar sesion */}
          <li>
            <button
              onClick={cerrarSesion}
              className="flex items-center mt-4 mx-5 text-negro text-base"
            >
              <svg
                className="fill-naranjaPrincipal mr-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="5 5 14 14"
              >
                <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
              </svg>
              Cerrar sesión
            </button>
          </li>
          {/* Donar */}
          <li>
            <button className="flex items-center mt-4 mx-5 text-negro text-base">
              <svg
                className="fill-naranjaPrincipal mr-3"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M17.726 13.02 14 16H9v-1h4.065a.5.5 0 0 0 .416-.777l-.888-1.332A1.995 1.995 0 0 0 10.93 12H3a1 1 0 0 0-1 1v6a2 2 0 0 0 2 2h9.639a3 3 0 0 0 2.258-1.024L22 13l-1.452-.484a2.998 2.998 0 0 0-2.822.504zm1.532-5.63c.451-.465.73-1.108.73-1.818s-.279-1.353-.73-1.818A2.447 2.447 0 0 0 17.494 3S16.25 2.997 15 4.286C13.75 2.997 12.506 3 12.506 3a2.45 2.45 0 0 0-1.764.753c-.451.466-.73 1.108-.73 1.818s.279 1.354.73 1.818L15 12l4.258-4.61z"></path>
              </svg>
              Donar
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
