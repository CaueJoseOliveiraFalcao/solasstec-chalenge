import api from '../../app/api'
import { useEffect , useState } from 'react'
import CreateAgendamentoForm from '../CreateAgendamentoForm/CreateAgendamentoForm';
import { QRCodeCanvas } from 'qrcode.react';

export default function Agendamento(){


    const [agendamentos ,setAgendamentos] = useState<any[]>([])

    //Variaveis para modal 
    const [openAcess , setOpenAcess] = useState(false)
    const [openCreateModal , setOpenCreateModal] = useState(false)
    
    const [codeSelecionado , setCodeSelecionado] = useState<string>(``)
    const [acessoSelecionado, setAcessoSelecionado] = useState<any | null>(null);


    //aponta alteracoes de horarios de disponibilidade no modal



    useEffect(() => {
        GetAgendamentos();
    }, [])
    const GetAgendamentos = async () => {
        try {
            const res = await api.get('/agendamento');
            console.log(res.data)
            setAgendamentos(res.data);
        } catch(error : any) {
            console.log(error.message);
        }
    }
    const OpenCreateModal = () => {
        setOpenCreateModal(true)
    }
    const OpenAcessModal = (agendamento : any) => {
        console.log(agendamento);
        setAcessoSelecionado(agendamento);
        setOpenAcess(true);
    };


    return (
        <div className='flex justify-center'>
            <div className="w-full my-10 p-6 bg-white rounded-2xl border-solid" style={{maxWidth : 1000}}>
                <div className='flex mb-7 justify-between items-center'>
                    <div>
                        <h1 className="mt-4 mb-2 text-3xl font-bold">Agendamento</h1>     
                        <p className='text-gray-400' >Gerenciamento de Visitas Agendadas</p>
                    </div>
  
                        <button
                            onClick={OpenCreateModal}
                            className="px-4 py-2 mt-4 cursor-pointer text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            +  Criar Agendamento
                        </button>         
                </div>
                <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                    <th scope="col" className="px-6 py-3">Visitante</th>
                    <th scope="col" className="px-6 py-3">Sala</th>
                    <th scope="col" className="px-6 py-3">Data Agendada</th>
                    <th scope="col" className="px-6 py-3">Horário</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 text-right py-3">Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {agendamentos.length > 0 ? (
                    agendamentos.map((agendamento) => (
                        <tr key={agendamento.id} className="bg-white border-b hover:bg-gray-50 transition-colors duration-150">
                        {/* Visitante */}
                        <td className="px-6 py-4">
                            {agendamento.visitante?.nome || '-'}
                        </td>

                        {/* Sala */}
                        <td className="px-6 py-4">
                            {agendamento.sala?.nome || '-'}
                        </td>

                        {/* Data */}
                        <td className="px-6 py-4">
                            {new Date(agendamento.data_agendada).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                            })}
                        </td>

                        {/* Horário */}
                        <td className="px-6 py-4">
                            {agendamento.hora_inicio} - {agendamento.hora_fim}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                            {agendamento.status === 1 ? (
                            <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                Ativo
                            </span>
                            ) : (
                            <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                                Inativo
                            </span>
                            )}
                        </td>

                        {/* Ações */}
                        <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-3">
                            <button
                                onClick={() => OpenAcessModal(agendamento)}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                            >
                                Gerar Acesso
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-6 text-center text-gray-400">
                        Nenhum agendamento encontrado.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>

            </div>
            {openCreateModal && (
                <CreateAgendamentoForm setOpenCreateModal={setOpenCreateModal}/>
            )}

            {openAcess && (
                <div className="fixed inset-0 flex items-center  justify-center bg-gray-950/50 backdrop-blur-md">
                    <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden"
                            style={{ maxWidth: 900, maxHeight: 700 }}>
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 700 }}>
                        <button className="font-bold cursor-pointer" onClick={() => setOpenAcess(false)}>X</button>
                          <div className="flex flex-col items-center mt-6">
                            <h2 className="text-xl font-bold mb-4">QR Code de Acesso</h2>
                            <QRCodeCanvas
                            value={(acessoSelecionado.code)} // ou apenas acessoSelecionado.code se quiser só o UUID
                            size={220}
                            includeMargin={true}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            />
                            <p className="mt-4 text-gray-600">
                            Código : {acessoSelecionado.code}
                            </p>
                            <p className="mt-4 text-gray-600">
                            Nome Sala : {acessoSelecionado.sala.nome}
                            </p>
                            <p className="mt-4 text-gray-600">
                            Nome Visitante : {acessoSelecionado.visitante.nome}
                            </p>
                            <p className="mt-4 text-gray-600">
                            Visitante Documento : {acessoSelecionado.visitante.documento}
                            </p>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
