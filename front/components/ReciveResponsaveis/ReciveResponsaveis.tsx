import api from '../../app/api'
import { useEffect , useState } from 'react'

export default function ReciveResponsaveis(){
    const [responsaveis , setResponsaveis] = useState<any[]>([])
    const [openEditModal , setOpenEditModal] = useState(false)

    const [idResponsavel , setIdResponsavel] = useState(0)
    const [nomeResponsavel , setNomeResponsavel] = useState('')
    const [validoAte , setValidoAte] = useState('')

    useEffect(() => {
        GetResponsaveis()
    }, [])

    const GetResponsaveis = async () => {
        try {
            const res = await api.get('/responsavel-sala')
            setResponsaveis(res.data)
        } catch(error : any) {
            console.log(error.message)
        }
    }

    const OpenModal = (obj : any) => {
        setIdResponsavel(obj.id)
        setNomeResponsavel(obj.nome)
        setValidoAte(obj.valido_ate ? new Date(obj.valido_ate).toISOString().split("T")[0] : '')
        setOpenEditModal(true)
    }
    const Submit = async (e : any) => {
        e.preventDefault()
        const data = {
            id : idResponsavel,
            nome : nomeResponsavel,
            //se der tempo criar um DTO so de edicao
            documento : '00000000000',
            valido_de : '1',
            valido_ate : validoAte ? new Date(validoAte) : new Date(),
        }
        try {
            const res = await api.post('/responsavel-sala/edit' , data)
            alert(res.data.message)
            window.location.reload()
        } catch (error : any){
            if (error.response && error.response.data) {
                alert(error.response.data.message)
            }
        }
    }

    const deleteResponsavel = async (id : Number) => {
        try {
            await api.delete(`/responsavel-sala/${id}`)
            alert('Responsável deletado com sucesso')
            window.location.reload()
        } catch (error: any) {
            console.log(error)
            alert('Erro ao deletar responsável ')
        } 
    }

    return (
        <div className='flex justify-center'>
            <div className="w-full my-10 p-6 bg-white rounded-2xl border-solid" style={{maxWidth : 1000}}>
                <h1 className="mt-4 mb-2 text-2xl font-bold">Gerenciar Responsáveis </h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">CPF</th>
                            <th scope="col" className="px-6 py-3">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {responsaveis.length > 0 ? (
                            responsaveis.map((resp) => (
                                <tr key={resp.id} className="bg-white border-b border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{resp.id}</th>
                                    <td className="px-6 py-4">{resp.nome}</td>
                                    <td className="px-6 py-4">{resp.documento}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => OpenModal(resp)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-400">Nenhum responsavel encontrado</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {openEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-950/50 backdrop-blur-md">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-full" style={{maxWidth : 900}}>
                        <button className="font-bold cursor-pointer" onClick={() => setOpenEditModal(false)}>X</button>
                        <form onSubmit={Submit} className="flex flex-col">
                            <label>Nome</label>
                            <input  type="text" value={nomeResponsavel} onChange={e => setNomeResponsavel(e.target.value)} required />
                        <button type='button'
                            className="px-4 py-2 bg-red-600 text-white w-40 mt-4 rounded hover:bg-red-700 transition"
                            onClick={() => deleteResponsavel(idResponsavel)}
                        >
                            DELETAR
                        </button>
                            <input type="submit" value="Enviar" className="enviar mt-4" />
                        </form>

                    </div>
                </div>
            )}
        </div>
    )
}
