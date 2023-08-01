import ModalComponent from "../../components/modal";
import { Album, ApiResponse, Track } from "../../types/interfaces";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import formatDuration from "../../utils/formatDuration";
import { apiUrl, apiUrlTrack, apiUrlTrackDelete, headers } from "../../utils/apiConfig";
import { Trash } from "phosphor-react";
import { MusicNotesPlus } from "phosphor-react";
import React from "react";

export default function HomePage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingAlbum, setIsAddingAlbum] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [albumId, setAlbumId] = useState<number | null>(null);

  const openModalNewAlbum = () => {
    setIsModalOpen(true);
    setIsAddingAlbum(true);
  };

  const openModalNewTrack = (albumId: number) => {
    setIsModalOpen(true);
    setIsAddingAlbum(false);
    setAlbumId(albumId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAlbumId(null); // Limpa o id do álbum quando a modal é fechada
  };

  const fetchAlbums = async (search?: string, page?: number) => {
    const endpoint = search
      ? `${apiUrl}?keyword=${encodeURIComponent(search)}`
      : `${apiUrl}?page=${page}`;
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(endpoint, { headers });
      setAlbums(response.data.data);
      setTotalPages(response.data.last_page); // Atualiza o total de páginas
      setCurrentPage(page || 1); // Atualiza o número da página atual
    } catch (error: any) {
      console.error('Erro na requisição:', error.message);
      setAlbums([]); // Limpa os álbuns em caso de erro
      setTotalPages(1); // Reinicia o total de páginas em caso de erro
      setCurrentPage(page || 1); // Reinicia o número da página atual em caso de erro
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchAlbums("", currentPage); // Passa a página atual como segundo parâmetro
    }
  }, [searchTerm, currentPage]); // Adiciona currentPage como dependência

  useEffect(() => {
    fetchAlbums(searchTerm, currentPage);
  }, [currentPage]);

  const handleSaveAlbum = async (values: Album) => {
    try {
      await axios.post(apiUrl, {
        name: values.name,
        year: values.year,
        tracks: values.tracks || [],
      }, { headers });
      closeModal();
      fetchAlbums(searchTerm, currentPage); // Atualiza a lista após salvar o novo álbum
    } catch (error: any) {
      console.error("Erro ao criar o novo álbum:", error.message);
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {

    const shouldDelete = window.confirm("Tem certeza que deseja excluir o álbum ?");
    if (shouldDelete) {
      try {
        // Realiza a chamada API para excluir o álbum usando axios.delete
        await axios.delete(`${apiUrl}/${albumId}`, { headers });
        fetchAlbums(searchTerm, currentPage); // Atualiza a lista após excluir o álbum
      } catch (error: any) {
        console.error("Erro ao excluir o álbum:", error.message);
      };
    }
  };

  const handleAddTrack = async (values: Track) => {

    try {
      // Converte a duração para segundos, caso seja uma entrada válida não vazia
      let durationInSeconds = 0;
      if (values.duration) {
        const durationParts = values.duration.split(":");
        const minutes = parseInt(durationParts[0], 10);
        const seconds = parseInt(durationParts[1], 10);
        durationInSeconds = minutes * 60 + seconds;
      }
      // Faz a requisição POST para criar uma nova faixa dentro do álbum especificado
      await axios.post<Track>(
        `${apiUrlTrack}/track`,
        {
          album_id: albumId!,
          title: values.title,
          duration: durationInSeconds,
          number: values.number,
        },
        { headers }
      );
      closeModal();
      fetchAlbums(searchTerm, currentPage); // Atualiza a lista de álbuns após criar a nova faixa
    } catch (error: any) {
      console.error("Erro ao criar a nova faixa:", error.message);
    }
  };

  const handleDeleteTrack = async (trackId: number) => {
    const shouldDelete = window.confirm("Tem certeza que deseja excluir a fáixa? ");
    if (shouldDelete) {
      try {
        // Realiza a chamada API para excluir a faixa usando axios.delete
        await axios.delete(`${apiUrlTrackDelete}/${trackId}`, { headers });
        fetchAlbums(searchTerm, currentPage); // Atualiza a lista após excluir a faixa
      } catch (error: any) {
        console.error("Erro ao excluir a faixa:", error.message);
      };
    }
  };


  return (

    <div className="bg-white bg-opacity-75 mt-5 mx-20 ">

      <div className="bg-white flex justify-between items-center  p-5">
        <img src="./src/assets/logo.png" alt="" />
        <p className="text-6xl">Discografia</p>
      </div>

      <div className="grid grid-cols-12 gap-4 border-red-700 h-full justify-center p-5">

        <div className="col-span-8">

          <input
            type="text"
            className="px-4 py-2 border rounded-full w-full"
            placeholder="Digite o nome do álbum e clique em procurar  "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <button
            title="Procurar álbum"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
            onClick={() => fetchAlbums(searchTerm, currentPage)}
          >
            Procurar
          </button>
        </div>

        <div className="col-span-2">
          <div>
            <button
              title="Criar álbum"
              className="w-full bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full"
              onClick={openModalNewAlbum}
            >
              Novo album
            </button>
          </div>
        </div>

        {/* Modal */}
        <ModalComponent
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          handleSaveAlbum={handleSaveAlbum}
          handleSaveTrack={handleAddTrack} // Aqui passamos a função para adicionar a faixa
          isAddingAlbum={isAddingAlbum}
          albumId={albumId || 0}
        />
      </div>

      <div className="p-5">
        {albums.length > 0 ? (
          <table className=" grid">
            <tbody >
              {albums.map((album, index) => {
                return (
                  <React.Fragment key={album.name}>
                    {index > 0 && <tr key={`spacer-${index}`}><td style={{ height: "20px" }}></td></tr>}
                    <tr >
                      <td className="px-2 py-2 flex font-medium" style={{ whiteSpace: "nowrap" }}>
                        Album: {album.name}, {album.year}
                        <button
                          title="Deletar álbum?"
                          className="ml-2 text-red-600"
                          onClick={() => handleDeleteAlbum(album.id!)}
                        >
                          <Trash size={20} />
                        </button>
                        <button
                          title="Adicionar página?"
                          className="ml-2 text-blue-600"
                          onClick={() => openModalNewTrack(album.id!)}
                        >
                          <MusicNotesPlus size={20} />
                        </button>
                      </td>
                    </tr>
                    {(album.tracks || []).length > 0 && (
                      <div key={`${album.name}-tracks`}>
                        <tr className="">
                          <td className="px-2 py-2 ">Nº</td>
                          <td className="px-2 py-2 ">Faixa
                          </td>
                          <td className="px-2 py-2  " style={{ width: "100%", textAlign: "right" }}>
                            Duração
                          </td>
                        </tr>
                        {album.tracks?.map((track) => (
                          <tr className="" key={`${album.name}-${track.number}`}>
                            <td className="px-2 py-2 ">{track.number}</td>
                            <td className="px-2 py-2 flex " style={{ whiteSpace: "nowrap" }}>
                              {track.title}
                              <button
                                title="Deletar faixa?"
                                className="ml-2 text-red-600"
                                onClick={() => handleDeleteTrack(track.id!)}
                              >
                                <Trash size={20} />
                              </button>
                            </td>
                            <td
                              className="px-2 py-2  duration-cell"
                              style={{ textAlign: "right", whiteSpace: "nowrap", paddingRight: "36px" }}
                            >
                              {formatDuration(track.duration)}
                            </td>
                          </tr>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          searchTerm.trim() !== "" && <p>Nenhum álbum encontrado.</p>
        )}
        {/* Botões de paginação */}
        <div className="flex justify-between items-center">
          <button
            title="Voltar página"
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full mt-4"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Página Anterior
          </button>
          <button
            title="Avançar página"
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded-full mt-4"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Próxima página
          </button>
        </div>
      </div>
    </div>
  );
}