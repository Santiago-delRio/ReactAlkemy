import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { LoginUsuario } from "../../components/LoginUsuario/LoginUsuario";

const Registro = () => {
  const navigate = useNavigate();

  // Switch pertenece a un equipo
  const [switchEquipo, setSwitchEquipo] = useState(false);
  const [camposFormulario, setCamposFormulario] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_IP}/auth/data`)
      .then((response) => response.json())
      .then((data) => setCamposFormulario(data.result));
  }, []);

  return (
    <main className="p-4 h-screen mx-auto max-w-md flex justify-center items-center overflow-y-auto">
      <Formik
        initialValues={{
          userName: "",
          password: "",
          email: "",
          teamCheckbox: false,
          teamID: "",
          role: "Team Member",
          continent: "America",
          region: "Latam",
        }}
        validate={(values) => {
          const errors = {};
          const regexMail =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          // No hay usuario
          if (!values.userName) {
            errors.userName = "*Campo obligatorio";
          }
          // Usuario solo contiene espacios en blanco
          if (values.userName && values.userName.trim() === "") {
            errors.userName = "*Campo obligatorio";
          }
          //   Usuario contiene numeros
          if (values.userName && /\d/.test(values.userName)) {
            errors.userName = "*El usuario no puede contener números";
          }
          //  Caracteres usuario
          if (values.userName && values.userName.length < 4) {
            errors.userName =
              "*El usuario no puede tener menos de 4 caracteres";
          }
          // No hay contraseña
          if (!values.password) {
            errors.password = "*Campo obligatorio";
          }
          //  Caracteres contraseña
          if (values.password && values.password.length < 6) {
            errors.password =
              "*La contraseña no puede tener menos de 6 caracteres";
          }
          //   Contraseña no contiene numeros
          if (values.password && !/\d/.test(values.password)) {
            errors.password = "*La contraseña debe tener al menos 1 número";
          }
          //   Contraseña no contiene letra mayúscula
          if (values.password && !/[A-Z]/.test(values.password)) {
            errors.password =
              "*La contraseña debe tener al menos 1 letra mayúscula";
          }
          // No hay email
          if (!values.email) {
            errors.email = "*Campo obligatorio";
          }
          //   Email inválido
          if (values.email && !regexMail.test(values.email)) {
            errors.email = "*El correo ingresado es inválido";
          }
          // Falta id del equipo
          if (values.teamCheckbox && !values.teamID) {
            errors.teamID = "*Campo obligatorio";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
          const teamID = !values.teamCheckbox ? uuidv4() : values.teamID;

          const resRegistro = await fetch(
            `${process.env.REACT_APP_SERVER_IP}/auth/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: {
                  userName: values.userName,
                  password: values.password,
                  email: values.email,
                  teamID,
                  role: values.role,
                  continent: values.continent,
                  region: values.region,
                },
              }),
            }
          );

          const dataRegistro = await resRegistro.json();

          if (dataRegistro.status_code === 201) {
            await LoginUsuario(values)
            navigate("/tareas", { replace: true });
          } else {
            alert(
              "Error en el registro, por favor, revise las credenciales ingresadas"
            );
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className="p-4 w-full m-auto flex flex-col bg-white rounded-lg border border-bordeGrisClaro">
            <h1 className="heading1 mb-2">Registro</h1>
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
            {/* Email */}
            <label className="inline-block text-base mb-1 mt-3">Email</label>
            <Field
              type="email"
              name="email"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            />
            <ErrorMessage
              name="email"
              component="span"
              className="text-sm text-naranjaPrincipal mt-1"
            />
            {/* Equipo */}
            {/* Switch equipo */}
            <div className="mt-3 flex items-center">
              <Field
                type="checkbox"
                name="teamCheckbox"
                id="teamCheckbox"
                onClick={() => {
                  setSwitchEquipo(!switchEquipo);
                }}
                className={`
                      cursor-pointer 
                      w-9 relative h-[14px]
                      before:content-[''] before:inline-block before:absolute before:left-0 before:top-0 before:w-full before:h-full before:bg-[#FFC5BE] before:rounded-full 
                      after:content-[''] after:inline-block after:absolute after:left-0 after:top-1/2 after:translate-y-[-50%]  after:w-5 after:h-5 after:rounded-full after:ease-in-out after:duration-150 
                      ${
                        switchEquipo
                          ? "after:bg-naranjaPrincipal after:translate-x-full"
                          : "after:bg-white after:shadow-lg"
                      }
                  `}
              />
              <label htmlFor="teamCheckbox" className="text-xs ml-2">
                Perteneces a un equipo ya creado
              </label>
            </div>
            {/* Identificador equipo */}
            {values.teamCheckbox === true && (
              <>
                <label className="inline-block text-base mb-1 mt-3">
                  Por favor, introduce el identificador de equipo
                </label>
                <Field
                  type="text"
                  name="teamID"
                  className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
                />
                <ErrorMessage
                  name="teamID"
                  component="span"
                  className="text-sm text-naranjaPrincipal mt-1"
                />
              </>
            )}
            {/* Rol */}
            <label className="inline-block text-base mb-1 mt-3">Rol</label>
            <Field
              name="role"
              as="select"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            >
              {camposFormulario &&
                camposFormulario.Rol.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
            </Field>

            {/* Continente */}
            <label className="inline-block text-base mb-1 mt-3">
              Continente
            </label>
            <Field
              component="select"
              name="continent"
              className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
            >
              {camposFormulario &&
                camposFormulario.continente.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
            </Field>
            {/* Región */}

            {values.continent === "America" && (
              <>
                <label className="inline-block text-base mb-1 mt-3">
                  Región
                </label>
                <Field
                  component="select"
                  name="region"
                  className="w-full p-2 rounded-lg border border-bordeGrisClaro focus:outline focus:outline-naranjaPrincipal text-xs text-grisFormularios"
                >
                  <option value="Otro">Otro</option>
                  <option value="Latam">Latam</option>
                  <option value="Brazil">Brazil</option>
                </Field>
              </>
            )}

            {/* Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btnNaranja"
            >
              Enviar
            </button>
            {/* Volver a inicio */}
            <Link to="/" className="text-base">
              Ir a iniciar sesión
            </Link>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default Registro;
