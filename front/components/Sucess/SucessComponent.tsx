interface SucessComponentType {
  titulo: string;
  desc: string;
  onClose: () => void;
}

export default function SucessComponent({ titulo, desc, onClose }: SucessComponentType) {
  return (
    <div
      className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex justify-between items-start"
      role="alert"
    >
      <div>
        <p className="font-bold">{titulo}</p>
        <p>{desc}</p>
      </div>
      <button
        className="font-bold ml-4 cursor-pointer"
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
}
