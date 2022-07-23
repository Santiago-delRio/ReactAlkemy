import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { crearTarea, editarTarea } from "../../store/actions/tareasActions";

const ModalCrearTarea = ({
  datos,
  cerrarModal,
  notificaciones
}) => {
  const dispatch = useDispatch();

  return (
    <section className="pointer-events-none fixed left-1/2 translate-x-[-50%] top-0 p-4 w-full max-w-[450px] h-screen flex justify-center items-center z-20 overflow-y-auto">
      <Formik
        initialValues={{
          title: datos.title,
          status: datos.status,
          importance: datos.importance,
          description: datos.description,
          editar: false,
        }}
        validate={(values) => {
          const errors = {};
          // No hay title
          if (!values.title) {
            errors.title = "*Campo obligatorio";
          }
          if (values.title && values.title.length < 6) {
            errors.title = "El titulo no puede tener menos de 6 caracteres";
          }
          // No hay descripcion
          if (!values.description) {
            errors.description = "*Campo obligatorio";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);

          const task = {
            title: values.title,
            status: values.status,
            importance: values.importance,
            description: values.description,
          };
          // Editar tarea
          if (datos.editar) {
            dispatch(editarTarea(datos.id, task));
            notificaciones("exito", "Tarea actualizada!");
            cerrarModal();
          }
          // Crear tarea
          if (!datos.editar) {
            dispatch(crearTarea("task", task));
            notificaciones("exito", "Tarea creada!");
            cerrarModal();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="pointer-events-auto p-4 w-full m-auto flex flex-col bg-white rounded-lg border border-bordeGrisClaro">
            <div className="mb-2 flex justify-between items-center">
              <h1 className="heading1 text-negro leading-tight">
                {datos.tituloCard}
              </h1>
              <button
                type="button"
                onClick={() => {
                  cerrarModal();
                }}
              >
                <svg
                  className="fill-negro"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="2 2 20 20"
                >
                  <path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path>
                </svg>
              </button>
            </div>
            {/* Usuario */}
            <label className="inline-block text-base mb-1">
              Nombre de la tarea
            </label>
            <Field
              type="text"
              name="title"
              className="w-full p-2 px-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            />
            <ErrorMessage
              name="title"
              component="span"
              className="text-sm text-naranjaPrincipal mt-1"
            />
            {/* Estado */}
            <label className="inline-block text-base mb-1 mt-3">Estado</label>
            <Field
              name="status"
              as="select"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            >
              <option value="NEW">Nueva</option>
              <option value="IN PROGRESS">En proceso</option>
              <option value="FINISHED">Finalizada</option>
            </Field>
            {/* Prioridad */}
            <label className="inline-block text-base mb-1 mt-3">
              Prioridad
            </label>
            <Field
              name="importance"
              as="select"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Field>
            {/* Descripcion */}
            <label className="inline-block text-base mb-1 mt-3">
              Descripción
            </label>
            <Field
              as="textarea"
              name="description"
              className="w-full h-24 p-2 px-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios resize-none"
            />
            <ErrorMessage
              name="description"
              component="span"
              className="text-sm text-naranjaPrincipal mt-1"
            />
            {/* Guardar cambios */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btnNaranja"
            >
              Guardar
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default ModalCrearTarea;
