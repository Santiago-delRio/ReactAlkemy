import { useState } from "react";
import Header from "../../components/Header";
import TareaCard from "../../components/TareaCard";
import ModalCrearTarea from "../../components/ModalCrearTarea";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useRef } from "react";
import { getTareas, borrarTarea } from "../../store/actions/tareasActions";

const Tareas = () => {
  const dispatch = useDispatch();
  // Tareas y estado de carga de las tareas
  const { loading, tareas } = useSelector((state) => {
    return state.tareasReducer;
  });
  const [tareasFiltradas, setTareasFiltradas] = useState([]);
  // Filtro del creador de las tareas
  const [filtroCreadorTareas, setFiltroCreadorTareas] = useState(false);
  // Controlar el modal para la creacion/edicion de tareas
  const [crearTarea, setCrearTarea] = useState(false);
  // Datos para la creacion de la tarea
  const [datosTarea, setDatosTarea] = useState({
    tituloCard: "Nueva tarea",
    status: "NEW",
    title: "",
    importance: "LOW",
    description: "",
    editar: false,
    id: 0,
  });

  // === Refs
  const filtroPrioridadTareas = useRef();
  const filtroBuscarTareas = useRef();

  // Bloquear scroll cuando el menu esta abierto
  useEffect(() => {
    crearTarea
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "inherit");
  }, [crearTarea]);

  // Fetch tareas
  useEffect(() => {
    dispatch(getTareas("task"));
  }, [dispatch]);

  // Filtrar tareas cuando cambia el filtro de creador de las tareas
  useEffect(() => {
    filtrarTareas();
  }, [filtroCreadorTareas, tareas]);

  //  Cerrar modal y dejar los campos vacios
  const cerrarModal = () => {
    setCrearTarea(false);
    setDatosTarea({
      tituloCard: "Nueva tarea",
      status: "NEW",
      title: "",
      importance: "LOW",
      description: "",
      editar: false,
      id: 0,
    });
  };

  // Notificaciones
  const notificaciones = (tipo, texto) => {
    // Info
    if (tipo === "info") {
      toast.info(texto, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Exito
    if (tipo === "exito") {
      toast.success(texto, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Error
    if (tipo === "error") {
      toast.error(texto, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Filtrar tareas
  const filtrarTareas = () => {
    let nuevasTareas = tareas;
    const prioridad = filtroPrioridadTareas.current.value;
    const busqueda = filtroBuscarTareas.current.value.trim().toLowerCase();

    // Filtrar por creador
    if (filtroCreadorTareas) {
      // Buscar mis tareas
      nuevasTareas = nuevasTareas.filter(
        (tarea) => tarea.user.userName === localStorage.getItem("user")
      );
    }

    // Filtrar por prioridad
    if (prioridad !== "ALL" && prioridad !== "Seleccionar") {
      nuevasTareas = nuevasTareas.filter(
        (tarea) => tarea.importance === prioridad
      );
    }

    // Filtrar por busqueda
    if (busqueda !== "") {
      nuevasTareas = nuevasTareas.filter((tarea) =>
        tarea.title.toLowerCase().includes(busqueda)
      );
    }
    setTareasFiltradas(nuevasTareas);
  };

  // Cargar tareas
  const cargarTareas = (status) => {
    return tareasFiltradas
      .filter((tarea) => tarea.status === status)
      .sort((x, y) => {
        return x.createdAt - y.createdAt;
      })
      .map((tarea) => (
        <TareaCard
          key={tarea._id}
          tarea={tarea}
          eliminarTarea={eliminarTarea}
          editarTarea={editarTarea}
        />
      ));
  };

  // Eliminar tarea
  const eliminarTarea = (id, userTarea) => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user === userTarea || role === "Team Leader") {
      dispatch(borrarTarea(id));
      notificaciones("info", "Tarea eliminada!");
    } else {
      notificaciones(
        "error",
        "Solo el team leader puede modificar tareas de otros usuarios!"
      );
    }
  };

  // Editar tarea
  const editarTarea = (tarea) => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");
    const userTarea = tarea.user.userName;

    if (user === userTarea || role === "Team Leader") {
      setDatosTarea({
        tituloCard: "Editar tarea",
        title: tarea.title,
        importance: tarea.importance,
        description: tarea.description,
        status: tarea.status,
        editar: true,
        id: tarea._id,
      });

      setCrearTarea(true);
    } else {
      notificaciones(
        "error",
        "Solo el team leader puede modificar tareas de otros usuarios!"
      );
    }
  };

  // Determinar la cantidad de tareas por status
  const cantidadTareas = (status) => {
    return tareasFiltradas.filter((tarea) => tarea.status === status).length;
  };

  return (
    <main className="sm:flex">
      <Header />
      <section
        aria-label="Tareas del equipo"
        className="grow 1 sm:h-screen sm:overflow-y-scroll"
      >
        {/* Notificacion tarea creada */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* Abrir modal para crear/editar tareas */}
        {crearTarea ? (
          <ModalCrearTarea
            datos={datosTarea}
            cerrarModal={cerrarModal}
            notificaciones={notificaciones}
            tareas={tareas}
          />
        ) : (
          ""
        )}

        {/* Esconder el fondo cuando el modal de tareas está abierto */}
        <div
          onClick={() => {
            cerrarModal();
          }}
          className={`
                fixed z-10 w-screen h-screen top-0 left-0 bg-black transition-[opacity,visibility] ease-in-out duration-[400ms]
                ${crearTarea ? "opacity-30" : "opacity-0 invisible"}
            `}
        ></div>

        {/* filtros tareas */}
        <section aria-label="Filtrar las tareas" className="p-5 bg-white">
          <h1 className="font-semibold text-4xl text-negro">Tareas</h1>
          <div className="flex items-center mt-2">
            <svg
              className="fill-gris shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
            >
              <path d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z"></path>
              <path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z"></path>
            </svg>
            <h2 className="font-medium text-base text-gris">
              Team ID: {localStorage.getItem("teamID")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-y-4 mt-4">
            {/* filtro mis tareas */}
            <div className="bg-[#FAFAFA] inline-flex w-max max-w-full p-2 rounded-[5px] mr-4">
              {/* todas */}
              <button
                onClick={() => {
                  setFiltroCreadorTareas(false);
                }}
                className={`py-1 px-2 rounded-[5px] font-medium outline-gris  ${
                  !filtroCreadorTareas
                    ? "bg-white shadow text-negro"
                    : "text-[#6F6F6F]"
                }`}
              >
                Todas
              </button>
              {/* mis tareas */}
              <button
                onClick={() => {
                  setFiltroCreadorTareas(true);
                }}
                className={`py-1 px-2 rounded-[5px] font-medium outline-gris  ${
                  filtroCreadorTareas
                    ? "bg-white shadow text-negro"
                    : "text-[#6F6F6F]"
                } ml-2`}
              >
                Mis tareas
              </button>
            </div>
            {/* Buscar tareas */}
            <div className="p-2 bg-[#FAFAFA] flex w-max max-w-full items-center rounded-[5px] mr-4">
              <svg
                className="mr-2 fill-gris shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
              </svg>
              <input
                className="placeholder:text-gris text-gris bg-transparent outline-none"
                type="text"
                placeholder="Seleccionar por titulo..."
                ref={filtroBuscarTareas}
                onChange={filtrarTareas}
              />
            </div>
            {/* Seleccionar prioridad */}
            <div className="p-2 bg-[#FAFAFA] flex w-max max-w-full items-center rounded-[5px]">
              <svg
                className="mr-2 fill-gris shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.001 1.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71z"></path>
              </svg>
              <select
                ref={filtroPrioridadTareas}
                onChange={filtrarTareas}
                className="text-gris bg-transparent cursor-pointer outline-gris"
              >
                <option value="Seleccionar">Seleccionar una prioridad</option>
                <option value="ALL">All</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </section>
        {/* Tareas */}
        <section
          aria-label="Listado de tareas del equipo"
          className="p-5 xl:grid xl:grid-cols-3 xl:gap-10"
        >
          {/* Tareas nuevas */}
          <section className="relative after:content-[''] after:block xl:after:hidden after:absolute after:w-full after:h-px after:bg-[#EEEEEE] after:bottom-[-24px]">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
              <div className="flex items-end">
                <h2 className="heading2 mr-3">Nuevas</h2>
                <span className="text-gris font-normal">
                  {cantidadTareas("NEW")}
                </span>
              </div>
              {/* Agregar tarea */}
              <button
                onClick={() => {
                  setCrearTarea(true);
                  setDatosTarea({
                    tituloCard: "Nueva tarea",
                    status: "NEW",
                    title: "",
                    importance: "LOW",
                    description: "",
                    editar: false,
                    id: 0,
                  });
                }}
              >
                <svg
                  className="fill-[#CCCCCC]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                </svg>
              </button>
            </header>
            {/* tareas */}
            {loading ? (
              // Cargar skeleton de las tareas
              <Skeleton count={5} />
            ) : tareasFiltradas ? (
              tareasFiltradas.filter((tarea) => tarea.status === "NEW").length >
              0 ? (
                // Hay tareas nuevas, cargarlas
                cargarTareas("NEW")
              ) : filtroCreadorTareas ? (
                <span>No cargaste tareas nuevas</span>
              ) : (
                <span>No hay tareas nuevas</span>
              )
            ) : (
              <span>No hay tareas nuevas</span>
            )}
          </section>
          {/* Tareas en proceso */}
          <section className="mt-12 xl:mt-0 relative after:content-[''] after:block xl:after:hidden after:absolute after:w-full after:h-px after:bg-[#EEEEEE] after:bottom-[-24px]">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
              <div className="flex items-end">
                <h2 className="heading2 mr-3">En proceso</h2>
                <span className="text-gris font-normal">
                  {cantidadTareas("IN PROGRESS")}
                </span>
              </div>
              {/* Agregar tarea */}
              <button
                onClick={() => {
                  setDatosTarea({
                    tituloCard: "Nueva tarea",
                    status: "IN PROGRESS",
                    title: "",
                    importance: "LOW",
                    description: "",
                    editar: false,
                    id: 0,
                  });
                  setCrearTarea(true);
                }}
              >
                <svg
                  className="fill-[#CCCCCC]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                </svg>
              </button>
            </header>
            {/* tareas */}
            {loading ? (
              // Cargar skeleton de las tareas
              <Skeleton count={5} />
            ) : tareasFiltradas ? (
              tareasFiltradas.filter((tarea) => tarea.status === "IN PROGRESS")
                .length > 0 ? (
                // Hay tareas en proceso, cargarlas
                cargarTareas("IN PROGRESS")
              ) : filtroCreadorTareas ? (
                <span>No cargaste tareas en proceso</span>
              ) : (
                <span>No hay tareas en proceso</span>
              )
            ) : (
              <span>No hay tareas en proceso</span>
            )}
          </section>
          {/* Tareas terminadas */}
          <section className="mt-12 xl:mt-0">
            {/* Header */}
            <header className="flex justify-between items-center mb-3">
              <div className="flex items-end">
                <h2 className="heading2 mr-3">Finalizadas</h2>
                <span className="text-gris font-normal">
                  {cantidadTareas("FINISHED")}
                </span>
              </div>
              {/* Agregar tarea */}
              <button
                onClick={() => {
                  setDatosTarea({
                    tituloCard: "Nueva tarea",
                    status: "FINISHED",
                    title: "",
                    importance: "LOW",
                    description: "",
                    editar: false,
                    id: 0,
                  });
                  setCrearTarea(true);
                }}
              >
                <svg
                  className="fill-[#CCCCCC]"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                >
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path>
                </svg>
              </button>
            </header>
            {/* tareas */}
            {loading ? (
              // Cargar skeleton de las tareas
              <Skeleton count={5} />
            ) : tareasFiltradas ? (
              tareasFiltradas.filter((tarea) => tarea.status === "FINISHED")
                .length > 0 ? (
                // Hay tareas terminadas, cargarlas
                cargarTareas("FINISHED")
              ) : filtroCreadorTareas ? (
                <span>No cargaste tareas finalizadas</span>
              ) : (
                <span>No hay tareas finalizadas</span>
              )
            ) : (
              <span>No hay tareas finalizadas</span>
            )}
          </section>
        </section>
      </section>
    </main>
  );
};

export default Tareas;
