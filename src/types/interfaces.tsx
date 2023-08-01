export interface Track {
  id?:number;
  album_id: number;
  number: number;
  title: string;
  duration: string;
}

export interface Album {
  id?: number;
  name: string;
  year: number;
  tracks?: Track[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Album[];
  last_page: number;
}

export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  handleSaveAlbum: (values: Album) => void;
  handleSaveTrack: (values: Track) => void; // Correção: A prop handleSaveTrack deve receber um objeto Track como parâmetro
  isAddingAlbum: boolean;
  albumId?: number; // Adicionar a propriedade albumId
}

export interface ModalComponentProps extends ModalProps {
  albumId: number;
}
