export default function DisplayImages({ imagesURL }) {
  return (
    <div>
      {imagesURL?.map((imageURL) => (
        <div className="grid grid-cols-2 mx-auto">
          <div class="aspect-square">
            <img
              src={imageURL}
              alt=""
            />
          </div>
        </div>
      ))}
    </div>
  );
}
