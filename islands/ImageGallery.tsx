import { FunctionComponent } from "preact";

type Props = {
  userId: string;
  rooms?: {
    roomId: string;
  }[];
};

const ImageGallery: FunctionComponent<Props> = ({ rooms, userId }) => {
  return (
    <div>
      {rooms?.map(({ roomId }) => (
        <div className="grid grid-cols-2 mx-auto">
          <div class="aspect-square">
            <img
              src={`https://lloisttdbzzohehwbofn.supabase.co/storage/v1/object/public/rooms_images/${userId}/${roomId}/original`}
              alt=""
            />
          </div>
          <div class="aspect-square">
            <img
              src={`https://lloisttdbzzohehwbofn.supabase.co/storage/v1/object/public/rooms_images/${userId}/${roomId}/generated_1`}
              alt=""
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
