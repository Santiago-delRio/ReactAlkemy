import { useEffect, useRef, useState } from "react";

const TareaCard = ({ tarea, eliminarTarea, editarTarea }) => {
  const [fechaTarea, setFechaTarea] = useState("");
  const [verMas, setVerMas] = useState(false)
  const [estadoVerMas, setEstadoVerMas] = useState(false)

  const descriptionRef = useRef()

  useEffect(() => {
    // Arreglar la fecha
    let fecha = new Date(tarea.createdAt).toLocaleString();
    setFechaTarea(fecha);
    // Detectar si es necesario el boton de ver mas en la descripcion
    if(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight) setVerMas(true)
  }, []);

  return (
    <article className="flex flex-col items-start bg-white rounded-[5px] p-4 mb-6 shadow-[0_8px_34px_-17px_rgba(225,218,217,0.44)] font-light">
      {/* titulo */}
      <div name="titulo" className="flex justify-between items-start w-full">
        <h3 className="text-lg text-negro font-medium leading-tight sm:text-xl">
          {tarea.title}
        </h3>
        <div className="flex justify-between items-center ml-3 py-[2px]">
          {/* Editar tarea */}
          <button
            onClick={() => {
              editarTarea(tarea);
            }}
          >
            <svg
              className="fill-gris origin-top scale-[0.85] sm:scale-[1.09]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M8.707 19.707 18 10.414 13.586 6l-9.293 9.293a1.003 1.003 0 0 0-.263.464L3 21l5.242-1.03c.176-.044.337-.135.465-.263zM21 7.414a2 2 0 0 0 0-2.828L19.414 3a2 2 0 0 0-2.828 0L15 4.586 19.414 9 21 7.414z"></path>
            </svg>
          </button>
          {/* Borrar tarea */}
          <button onClick={()=>{eliminarTarea(tarea._id, tarea.user.userName)}} className="ml-4">
            <svg
              className="fill-gris origin-top scale-[0.85] sm:scale-[1.09]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Usuario */}
      <div className="mt-2 flex items-center w-full">
        <svg
          className="fill-gris mr-2 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 25 25"
        >
          <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
        </svg>
        <span title={tarea.user.userName} className="w-full text-gris text-sm truncate">
          {tarea.user.userName}
        </span>
      </div>
      {/* Fecha */}
      <span className="mt-2 text-gris text-sm">{fechaTarea}</span>
      {/* Prioridad */}
      <span
        className={`
          mt-2 text-sm py-1 px-3 rounded-[5px]
          ${
            tarea.importance === "HIGH"
              ? "bg-[#FFC9C2] text-[#5D312C]"
              : tarea.importance === "MEDIUM"
              ? "bg-[#FFF2C2] text-[#5A4F2A]"
              : "bg-[#CEE6FF] text-[#2F4964]"
          }
      `}
      >
        {tarea.importance.toLowerCase()}
      </span>
      {/* Descripcion */}
      <p ref={descriptionRef} className={`mt-2 text-gris text-sm ${estadoVerMas ? "line-clamp-none" : "line-clamp-3"}`} onLoad={()=>{console.log("hola")}}>
        {tarea.description}
      </p>
      {/* ver mas */}
      {verMas ? (
        <button onClick={()=>{setEstadoVerMas(!estadoVerMas)}} className="mt-2 text-negro font-normal text-xs sm:text-sm">
          {estadoVerMas ? "Ver menos" : "Ver más"}
        </button>
      ) : (
        ""
      )}
    </article>
  );
};

export default TareaCard;
