import { Formik, Form, Field, ErrorMessage } from "formik";
import Modal from "react-modal";
import { ModalComponentProps } from "../../types/interfaces";
import { albumValidationSchema, trackValidationSchema } from "../../utils/validationsForm";




const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onRequestClose, isAddingAlbum, handleSaveAlbum, handleSaveTrack, albumId }) => {


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Exemplo de Modal"
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.801)",
        },
        content: {
          padding: "0",
          justifyContent: "space-evenly",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          width: "25%",
          height: "45%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgb(204, 204, 204)",
          background: "rgba(214, 240, 255, 0.466)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
      }}
      ariaHideApp={false}
    >
      <>
        {isAddingAlbum ? ( // Renderiza o formulário para adicionar um álbum
          <Formik
            initialValues={{ name: "", year: 0 }}
            validationSchema={albumValidationSchema}
            onSubmit={handleSaveAlbum}
          >
            <Form>
              <div>
                <div style={{ marginBottom: "5px", width: "100%" }}>
                  <label htmlFor="name" className="font-semibold">Nome do Álbum: </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                  />
                  <div style={{ color: "#ff4444", fontSize: "0.8rem", textAlign: "left", minHeight: "1.5rem" }}>
                    <ErrorMessage name="name" />
                  </div>
                </div>

                <div style={{ marginBottom: "5px", width: "100%" }}>
                  <label htmlFor="year" className="font-semibold">Ano do Álbum: </label>
                  <Field
                    type="number"
                    id="year"
                    name="year"
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                  />
                  <div style={{ color: "#ff4444", fontSize: "0.8rem", textAlign: "left", minHeight: "1.5rem" }}>
                    <ErrorMessage name="year" />
                  </div>
                </div>

                <div className="flex justify-around">
                  <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full" type="button" onClick={onRequestClose}>
                    Cancelar
                  </button>
                  <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-full" type="submit">
                    Salvar
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        ) : ( // Renderiza o formulário para adicionar uma faixa
          <Formik
            initialValues={{ title: "", duration: "", number: "" }}
            validationSchema={trackValidationSchema}
            onSubmit={(values) => {
              // Convertendo o valor do campo number para um número inteiro (ou 0 se estiver vazio ou não for um número válido)
              const trackNumber = parseInt(values.number, 10) || 0;

              // Adicionando o número da faixa ao objeto values antes de chamar a função handleSaveTrack
              handleSaveTrack({ ...values, album_id: albumId, number: trackNumber });
            }}
          >
            <Form>
              <div>
                <div style={{ marginBottom: "5px", width: "100%" }}>
                  <label htmlFor="title" className="font-semibold">Título da Faixa: </label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                  />
                  <div style={{ color: "#ff4444", fontSize: "0.8rem", textAlign: "left", minHeight: "1.5rem" }}>
                    <ErrorMessage name="title" />
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: "5px", width: "100%" }}>
                    <label htmlFor="duration" className="font-semibold">Duração da Faixa (HH:mm): </label>
                    <Field
                      type="text"
                      id="duration"
                      name="duration"
                      style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                    />
                    <div style={{ color: "#ff4444", fontSize: "0.8rem", textAlign: "left", minHeight: "1.5rem" }}>
                      <ErrorMessage name="duration" />
                    </div>
                  </div>

                  <div style={{ marginBottom: "5px", width: "100%" }}>
                    <label htmlFor="number" className="font-semibold">Número da faixa  </label>
                    <Field
                      type="number"
                      id="number"
                      name="number"
                      style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px", width: "100%" }}
                    />
                    <div style={{ color: "#ff4444", fontSize: "0.8rem", textAlign: "left", minHeight: "1.5rem" }}>
                      <ErrorMessage name="number" />
                    </div>
                  </div>
                </div>


                <div className="flex justify-around">
                  <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full" type="button" onClick={onRequestClose}>
                    Cancelar
                  </button>
                  <button className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-full" type="submit">
                    Salvar
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        )}
      </>
    </Modal>
  );
};

export default ModalComponent;