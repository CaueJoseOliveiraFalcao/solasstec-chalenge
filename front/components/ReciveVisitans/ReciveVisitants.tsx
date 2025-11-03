import api from '../../app/api'
import { useEffect , useState } from 'react'

export default function ReciveVisitants(){
    const [visitantes, setVisitantes] = useState<any[]>([]);
    const [tiposPrioridades , setTipoPrioridades] = useState<any[]>([])
    const [openEditModal , setOpenEditModal] = useState(false);

    //Variaveis para o Modal de edicao
    const [id , setId] = useState(0);
    const [tipo_prioridade_id , setTipoPrioridadeId] = useState(0);
    const [name , setName] = useState('');
    const [document , setDocument] = useState('');
    const [phone , setPhone] = useState('');
    const [date , setDate] = useState('');
    const [acessoPrioritario , setAcessoPrioritario] = useState(false);
    const [descricaoPrioridade , setDescricaoPrioridade] = useState("");
    const [nivelPrioridade , setNivelPrioridade] = useState(0);


    useEffect(() => {
        GetVisitants();
        GetTipoPrioridade();
    }, [])
    const GetTipoPrioridade = async () => {
        try {
            const res = await api.get('/tipo-prioridade');
            setTipoPrioridades(res.data);
        } catch(error : any) {
            console.log(error.message)
        }
    }
    const GetVisitants = async () => {
        try {
            const res = await api.get('/visitante');
            setVisitantes(res.data)
        }
        catch(error) {
            console.log(error);
        }
    }
    const OpenModal = (obj : any) => {
            setTipoPrioridadeId(obj.tipo_prioridade_id)
            setId(obj.id)
            setName(obj.nome)
            setDocument(obj.documento)
            setPhone(obj.phone)
            setDate(new Date(obj.data_nascimento).toISOString().split('T')[0])
            setDescricaoPrioridade(obj.descricao)
            setNivelPrioridade(obj.nivel)
            setAcessoPrioritario(!!obj.descricao || obj.nivel > 0)
            setOpenEditModal(true)
    }
    const GetTipoPrioridadeInfo = (id : number) => {
        const tipo = tiposPrioridades.find((element) => element.id === id);
       return tipo ?
            {
                descricao : tipo.descricao,
                nivel : tipo.nivel_prioridade
            }
        : {descricao : '-', nivel : '-'}
    }
    const Submit = async (e : any) => {
        e.preventDefault();
        const data = {
            "nome" : name,
            "documento" : document,
            "phone" : phone,
            "data_nascimento" : new Date(date),
            "tipo_prioridade_id" : tipo_prioridade_id,
            "id" : id,
            "is_tipo_prioridade" : acessoPrioritario,
            "descricao" : acessoPrioritario ? descricaoPrioridade : null,
            "nivel_prioridade" : acessoPrioritario ? nivelPrioridade : null,
            "ativo" : true,
        }
        try {
            const res = await api.post('/visitante/editar' , data)
            alert('usuario alterado com sucesso')
            window.location.reload()

        } catch (error : any){
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;    
                console.log(message);
            }
        }

    }
    const deleteVisitante = async (id : Number) => {
        try {
            await api.delete(`/visitante/${id}`);
            alert('Visitante deletado com sucesso!');
            window.location.reload();
        } catch (error: any) {
            console.error(error);
            alert('Erro ao deletar visitante');
        } 
    }
    return (
        <div className='flex justify-center'>
            <div className="w-full mt-10 mb-10 p-6 bg-white rounded-2xl border-solid" style={{maxWidth : 1000}}>
                <h1 className="mt-4 mb-2 text-2xl font-bold">Gerenciar Visitantes</h1>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">Documento</th>
                            <th scope="col" className="px-6 py-3">Telefone</th>
                            <th scope="col" className="px-6 py-3">Data Nascimento</th>
                            <th scope="col" className="px-6 py-3">Descricao</th>
                            <th scope="col" className="px-6 py-3">Nivel Prioriade</th>
                            <th scope="col" className="px-6 py-3">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitantes.length > 0 ? (
                            visitantes.map((visitante) => {
                            const tipo = visitante.tipo_prioridade_id != null 
                                            ? GetTipoPrioridadeInfo(visitante.tipo_prioridade_id)
                                            : {descricao : '-' , nivel : '-'}
                            return(
                            <tr key={visitante.id} className="bg-white border-b  border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {visitante.id}
                                </th>
                                <td className="px-6 py-4">
                                    {visitante.nome}
                                </td>
                                <td className="px-6 py-4">
                                    {visitante.documento}
                                </td>
                                <td className="px-6 py-4">
                                    {visitante.phone}
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(visitante.data_nascimento).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    {tipo.descricao}
                                </td>
                                <td className="px-6 py-4">
                                    {tipo.nivel}
                                </td>          
                                <td className="px-6 py-4">
                                <button

                                onClick={() => OpenModal({
                                    id : visitante.id,
                                    nome : visitante.nome,
                                    documento : visitante.documento,
                                    phone : visitante.phone,
                                    data_nascimento : visitante.data_nascimento,
                                    tipo_prioridade_id : visitante.tipo_prioridade_id,
                                    descricao : tipo.descricao != '-' ? tipo.descricao : '',
                                    nivel : tipo.nivel != '-' ? tipo.nivel : 0,
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
                                Nenhum visitante encontrado.
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
                                <label htmlFor="nome">Nome</label>
                                <input type="text" 
                                    value={name} 
                                    onChange={(e) => {setName(e.target.value)}} 
                                    required />
                                <label htmlFor="numero">Telefone</label>
                                <input type="text" 
                                    value={phone} 
                                    onChange={(e) => {setPhone(e.target.value)}}                         
                                    required/>
                                <label htmlFor="data_nascimento">Data Nascimento</label>
                                <input 
                                    onChange={(e) => setDate(e.target.value)}
                                    value={date}
                                    required type="date" />
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="flex items-center mt-2">
                                    <label htmlFor="check">Acesso Prioritario</label>
                                    <input
                                    onChange={(e) => {setAcessoPrioritario(e.target.checked)}} 
                                    checked={acessoPrioritario}
                                    className="check-input" type="checkbox" name="prioridade" id="prioridade" />
                                </div>
                                {acessoPrioritario && (
                                    <>
                                        <label htmlFor="descricao">Descricao</label>
                                        <input type="text"
                                            value={descricaoPrioridade} 
                                            onChange={(e) => {setDescricaoPrioridade(e.target.value)}} 
                                            required  />
                                        <label htmlFor="nivel_prioridade">Nivel de Acesso (1 a 3)</label>
                                        <input type="number" 
                                            min={0}
                                            max={3}
                                            value={nivelPrioridade}
                                            onChange={(e) => setNivelPrioridade(Number(e.target.value))}required />
                                    </>

                                )}
                                <button
                                    className="px-4 py-2 bg-red-600 text-white w-40 mt-4 rounded hover:bg-red-700 transition"
                                    onClick={() => deleteVisitante(id)}
                                >
                                    DELETAR
                                </button>
                            </div>
                            <input
                                type="submit"
                                value="Enviar"
                                className="enviar"
                                />


                    </form>
                    </div>
                </div> 
            )}

        </div>
    )
}