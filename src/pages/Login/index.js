import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { LoginUsuario } from "../../components/LoginUsuario/LoginUsuario";

const Login = () => {
  const navigate = useNavigate();
  return (
    <main className="p-4 h-screen mx-auto max-w-md flex justify-center items-center overflow-y-auto">
      <Formik
        initialValues={{ userName: "", password: "" }}
        validate={(values) => {
          const errors = {};
          // No hay usuario
          if (!values.userName) {
            errors.userName = "*Campo obligatorio";
          }
          if (values.userName && values.userName.length < 4) {
            errors.userName = "*Ingrese al menos 4 caracteres";
          }
          // No hay contraseña
          if (!values.password) {
            errors.password = "*Campo obligatorio";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);

          const loginStatus = await LoginUsuario(values)

          if (loginStatus === 200){
            navigate("/tareas", { replace: true });
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Credenciales inválidas',
              text: 'El usuario o la contraseña son incorrectos, por favor, intentelo de nuevo',
            })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="p-4 w-full m-auto flex flex-col bg-white rounded-lg border border-bordeGrisClaro">
            <h1 className="heading1 mb-2">Iniciar sesión</h1>
            {/* Usuario */}
            <label className="inline-block text-base mb-1">
              Nombre de usuario
            </label>
            <Field
              type="text"
              name="userName"
              className="w-full p-2 px-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            />
            <ErrorMessage
              name="userName"
              component="span"
              className="text-sm text-naranjaPrincipal mt-1"
            />
            {/* Contraseña */}
            <label className="inline-block text-base mb-1 mt-3">
              Contraseña
            </label>
            <Field
              type="password"
              name="password"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            />
            <ErrorMessage
              name="password"
              component="span"
              className="text-sm text-naranjaPrincipal mt-1"
            />
            {/* Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btnNaranja"
            >
              Enviar
            </button>
            {/* Registrarme */}
            <Link to="/registro" className="text-base">
              Registrarme
            </Link>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default Login;
