interface ErrorComponentTypes {
    titulo : string,
    desc : string,
    onClose : () => void 
}

export default function ErrorComponent ({titulo , desc , onClose}:ErrorComponentTypes){
    return (
            <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 flex justify-between items-start" role="alert">
                <div>
                <p className="font-bold">{titulo}</p>
                <p>{desc}</p>
                </div>
                <button 
                className="font-bold ml-4 cursor-pointer" 
                onClick={(onClose)}
                >
                X
                </button>
            </div>
    )
}