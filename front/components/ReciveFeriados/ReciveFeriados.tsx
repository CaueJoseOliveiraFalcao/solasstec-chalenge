import api from '../../app/api'
import { useEffect , useState } from 'react'

export default function ReciveFeriados(){
    const [feriados , setFeriados] = useState<any[]>([])
    const [openEditModal , setOpenEditModal] = useState(false);

    //Variaveis para o Modal de edicao
    const [idFeriado , setIdFeriado] = useState(0);
    const [dataFeriado , setDataFeriado] = useState('');
    const [tipoFeriado , setTipoFeriado] = useState(0);
    const [descricaoFeriado , setDescricao] = useState('');


    useEffect(() => {
        GetFeriados();
    }, [])
    const GetFeriados = async () => {
        try {
            const res = await api.get('/feriado');
            setFeriados(res.data);

        } catch(error : any) {
            console.log(error.message)
        }
    }
    const OpenModal = (obj : any) => {
            setIdFeriado(obj.id)
            setDescricao(obj.descricao)
            setDataFeriado(new Date(obj.data).toISOString().split("T")[0]);
            setTipoFeriado(obj.tipo)
            setOpenEditModal(true)
    }
    const Submit = async (e : any) => {
        e.preventDefault();
        const data = {
            "id_feriado" : idFeriado,
            "descricao" : descricaoFeriado,
            "data" : dataFeriado,
            "tipo" : tipoFeriado,
            "ativo" : true,
        }
        try {
            const res = await api.post('/feriado/edit' , data)
            console.log(res)
            alert(res.data.message)
            window.location.reload()
        } catch (error : any){
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;    
                alert(error.data.message)
            }
        }

    }
    const deleteFeriado = async (id : Number) => {
        try {
            await api.delete(`/feriado/${id}`); // ajuste a URL conforme seu backend
            alert('Feriado deletado com sucesso!');
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            alert('Erro ao deletar feriado');
        } 
    }
    return (
        <div className='flex justify-center'>
            <div className="w-full my-10  p-6 bg-white rounded-2xl border-solid" style={{maxWidth : 1000}}>
                <h1 className="mt-4 mb-2 text-2xl font-bold">Gerenciar Feriados</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Data_Feriado</th>
                            <th scope="col" className="px-6 py-3">Descricao</th>
                            <th scope="col" className="px-6 py-3">Tipo_Feriado</th>
                            <th scope="col" className="px-6 py-3">Criado_Em</th>
                            <th scope="col" className="px-6 py-3">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feriados.length > 0 ? (
                            feriados.map((feriado) => {
                            return(
                            <tr key={feriado.id} className="bg-white border-b  border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {feriado.id}
                                </th>
                                <td className="px-6 py-4">
                                    {new Date(feriado.data).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {feriado.descricao}
                                </td>
                                <td className="px-6 py-4">
                                    {feriado.tipo}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(feriado.criado_em).toLocaleDateString()}
                                </td> 
                                <td className="px-6 py-4">
                                <button
                                onClick={() => OpenModal({
                                    id : feriado.id,
                                    data : feriado.data,
                                    descricao : feriado.descricao,
                                    tipo : feriado.tipo ? feriado.tipo : 0,
                                    criado : feriado.criado_em,
                                    ativo : feriado.ativo,
                                })}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Editar
                                </button>
                                </td>     
                            </tr>
                            )

                            })

                        ) : (
                            <tr>
                                <td colSpan={7} className=" cursor-pointer px-6 py-4 text-center text-gray-400">
                                Nenhum feriado encontrado.
                                </td>
                            </tr>

                        )}

                    </tbody>
                </table>
            </div>
            {openEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-950/50 backdrop-blur-md">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-full" style={{maxWidth : 900}}>
                        <button
                            className="font-bold cursor-pointer"
                            onClick={() => setOpenEditModal(false)}
                        >
                            X
                        </button>
                        <form action="POST" onSubmit={(e) => Submit(e)} className="flex flex-col">
                            <div className="flex justify-around w-full flex-col">
                                <label htmlFor="nome">Data : </label>
                                <input type="date" 
                                    value={dataFeriado} 
                                    onChange={(e) => {setDataFeriado(e.target.value)}} 
                                    required />
                                <label htmlFor="numero">Descricao</label>
                                <input type="text" 
                                    value={descricaoFeriado} 
                                    onChange={(e) => {setDescricao(e.target.value)}}                         
                                    required/>
                                <label htmlFor="data_nascimento">Tipo (nacional = 1 , estadual = 2 , 3 = municipal)</label>
                                <input 
                                    onChange={(e) => setTipoFeriado(Number(e.target.value))}
                                    min={0}
                                    max={3}
                                    value={tipoFeriado}
                                    type="number" />
                            </div>

                            <input
                                type="submit"
                                value="Enviar"
                                className="enviar"
                                />
                        </form>
                            <button
                                    className="px-4 py-2 bg-red-600 text-white w-40 mt-4 rounded hover:bg-red-700 transition"
                                    onClick={() => deleteFeriado(idFeriado)}
                                >
                                    DELETAR
                                </button>
                    </div>
                </div> 
            )}

        </div>
    )
}