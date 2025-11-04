import api from '../../app/api'
import { useEffect , useState } from 'react'
import ErrorComponent from '../Error/ErrorComponent';
import SucessComponent from '../Sucess/SucessComponent';
import CreateSalaForm from '../CreateSalaForm/CreateSalaForm';
interface Dia {
  open: boolean
  init: string
  end: string
}
interface DiasDaSemana {
  Segunda?: Dia
  Terca?: Dia
  Quarta?: Dia
  Quinta?: Dia
  Sexta?: Dia
  Sabado?: Dia
  Domingo?: Dia
}

export default function Salas(){


    const [salas , setSalas] = useState<any[]>([])

    const [errorPopup, setErroPopup] = useState({ error: false, titulo: '', desc: '' });
    const [successPopup, setSuccessPopup] = useState({ success: false, titulo: '', desc: '' });

    //Variaveis para modal 
    const [openEditModal , setOpenEditModal] = useState(false)
    const [openCreateModal , setOpenCreateModal] = useState(false)
    const [salaId, setSalaId] = useState<number | null>(null);
    const [salaNome, setSalaNome] = useState<string>('');
    const [salaCapacidade, setCapacidade] = useState<number>(0);

    //aponta alteracoes de horarios de disponibilidade no modal
    const [oqueMudou, setSalaOqueMudoou] = useState<{}>({
        alteracoes_de_disponibilidade : {},
        alteracoes_de_responsavel : {}
    });

    const [salaDisponibilidade, setSalaDisponibilidade] = useState<string>('');

    const [salaResponsavelId, setSalaResponsavelId] = useState<number | null>(null);

    const [diasDaSemana , setDiasDaSemana] = useState<DiasDaSemana>({
        Segunda : {open : true , init : "08:00" , end : "17:00"},
        Terca : {open : true , init : "08:00" , end : "17:00"},
        Quarta : {open : true , init : "08:00" , end : "17:00"},
        Quinta : {open : true , init : "08:00" , end : "18:00"},
        Sexta : {open : true , init : "08:00" , end : "18:00"},
        Sabado : {open : false , init : "00:00" , end : "00:00"},
        Domingo : {open : false , init : "00:00" , end : "00:00"},
    })
    //quando modal abre guarda o valor antigo para comparar no submit
    const [diasDaSemanaAntigo , setDiasDaSemanaAntigo] = useState<DiasDaSemana>({})

    const [todosResponsaveisDisponiveis , setResponsaveis] = useState<any[]>([])
    //caso responsavel antigo seja diferente do selecionado back muda
    const [responsavelAntigoId, setResponsavelAntigoId] = useState<number | null>(null);
    const [responsavelId, setResponsavelId] = useState<number | null>(null);
    const [responsavelSelecionado, setResponsavelSelecionado] = useState<number | ''>('')

    useEffect(() => {
        GetSalas();
        GetResponsaveis();
    }, [])
    const GetSalas = async () => {
        try {
            const res = await api.get('/sala');
            setSalas(res.data);
        } catch(error : any) {
            console.log(error.message)
        }
    }
    const GetResponsaveis = async () => {
        try {
            const res = await api.get('/responsavel-sala')
            setResponsaveis(res.data)
        } catch(error : any) {
            console.log(error.message)
        }
    }
    const formatarHorarios = (horaRios : string) => {
        const parsedDays = JSON.parse(horaRios) as Record<
            string, 
            {open : boolean , init : string , end : string}
            >;
        
        const findOpenDays = Object.entries(parsedDays).filter(
            ([_,value]) => value.open
        )

        const group : Record<string, string[]> = {};

        //formatacao 
        const diasMap: Record<string, string> = {
        'Segunda': 'Seg',
        'Terca': 'Ter',
        'Quarta': 'Qua',
        'Quinta': 'Qui',
        'Sexta': 'Sex',
        'Sabado': 'Sáb',
        'Domingo': 'Dom'
        };

        for(let [nome , value] of findOpenDays){
            const key = `${value.init}-${value.end}`;
            if(!group[key]){
                group[key] = []
            }
            nome = diasMap[nome] || nome;
            group[key].push(nome)
        }

        const final = Object.entries(group).map(([horarios , nomesDiasSemanas ]) => {
            const [init , end] = horarios.split('-')
            return `${nomesDiasSemanas.join(`,`)}: ${init} - ${end}`;
        })

        return final
        }
    const OpenCreateModal = () => {
        setOpenCreateModal(true)
    }
    const OpenModal = (obj : any) => {
        setOpenEditModal(true)
        setSalaId(obj.id || null);
        setSalaNome(obj.nome || '');
        setCapacidade(obj.capacidade || 0);
        setSalaDisponibilidade(obj.disponibilidade || '');
        setSalaResponsavelId(obj.responsavel_id || null);
        setDiasDaSemana(JSON.parse(obj.disponibilidade));
        setDiasDaSemanaAntigo(JSON.parse(obj.disponibilidade));
        //logica para atualizar o id_responsavel se for nulo
        if (obj.responsavel && obj.responsavel.id) {
            const idResp = Number(obj.responsavel.id);
            setResponsavelAntigoId(idResp);
            setResponsavelId(idResp);
            setResponsavelSelecionado(idResp);
        } else {
            setResponsavelAntigoId(null);
            setResponsavelId(null);
            setResponsavelSelecionado('');
        }

    }
    const Submit = async (e : any) => {
        e.preventDefault()

        const alteracoes: Record<string, any> = {};
        //compara disponibilidadeAtual Com a antiga oque mudou ele joga em setSalaOqueMudoou
        Object.entries(diasDaSemana).map((diaDaSemana) => {
            const [nome , diaDaSemanaValues ] = diaDaSemana;
            const diaDaSemanaAntigo = diasDaSemanaAntigo[nome as keyof DiasDaSemana] || null
            if(diasDaSemanaAntigo){
                const mudancas: Record<string, any> = {};

                if (diaDaSemanaValues.init !== diaDaSemanaAntigo?.init) {
                    mudancas.old_init = diaDaSemanaAntigo?.init;
                    mudancas.new_init = diaDaSemanaValues.init;
                }
                if (diaDaSemanaValues.end !== diaDaSemanaAntigo?.end) {
                    mudancas.old_end = diaDaSemanaAntigo?.end;
                    mudancas.new_end = diaDaSemanaValues.end;
                }
                if (diaDaSemanaValues.open !== diaDaSemanaAntigo?.open) {
                    mudancas.old_open = diaDaSemanaAntigo?.open;
                    mudancas.new_open = diaDaSemanaValues.open;
                }

                if (Object.keys(mudancas).length > 0) {
                    alteracoes[nome.toLowerCase()] = mudancas;

                }
            }
        },)

        let resultadoFinal: Record<string, any> = {
            alteracoes_de_disponibilidade: alteracoes,
        };
        if (responsavelAntigoId !== responsavelId) {
            resultadoFinal = {
                ...resultadoFinal,
                alteracoes_de_responsavel: {
                    old_id: responsavelAntigoId,
                    new_id: responsavelId,
                },
            };
        }
        setSalaOqueMudoou(resultadoFinal);
        const data = {
            id: salaId,
            nome: salaNome,
            capacidade: salaCapacidade,
            disponibilidade: JSON.stringify(diasDaSemana),
            responsavel_id: responsavelId,
            alteracoes: resultadoFinal, 
        };
        try {
            const res = await api.post('/sala/edit' , data)
            alert(res.data.message)
            window.location.reload();
        } catch (error : any){
            if (error.response && error.response.data) {
                alert(error.response.data.message)
            }
        }
    }

    const deleteResponsavel = async (id : Number) => {
        try {
            await api.delete(`/responsavel-sala/${id}`)
            alert('Responsavel deletado com sucesso')
            window.location.reload()
        } catch (error: any) {
            console.log(error)
            alert('Erro ao deletar responsavel')
        } 
    }

    return (
        <div className='flex justify-center'>
            <div className="w-full my-10 p-6 bg-white rounded-2xl border-solid" style={{maxWidth : 1000}}>
                <div className='flex mb-7 justify-between items-center'>
                    <div>
                        <h1 className="mt-4 mb-2 text-3xl font-bold">Salas</h1>     
                        <p className='text-gray-400' >Gerencie  as salas e seus horarios de funcionamento</p>
                    </div>
  
                        <button
                            onClick={OpenCreateModal}
                            className="px-4 py-2 mt-4 cursor-pointer text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            +  Criar Sala
                        </button>         
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nome Sala</th>
                            <th scope="col" className="px-6 py-3">Responsavel</th>
                            <th scope="col" className="px-6 py-3">Capacidade</th>
                            <th scope="col" className="px-6 py-3">Horarios</th>
                            <th scope="col" className="px-6 py-3">Criada Em</th>
                            <th scope="col" className="px-6 text-right py-3">Acoes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salas.length > 0 ? (
                            salas.map((resp) => (
                                <tr key={resp.id} className="bg-white border-b border-gray-200">
                                    <td className="px-6 py-4">{resp.id}</td>
                                    <td className="px-6 py-4">{resp.nome}</td>
                                    <td className="px-6 py-4">{resp.responsavel ? resp.responsavel.nome : '-'}</td>
                                    <td className="px-6 py-4 ">
                                        <div style={{width : 45}} className=" rounded-md flex p-2 items-center gap-2 bg-green-200">
                                            <img width={10} height={10} src="./avatar.png" alt="Avatar"/>
                                            <span>{resp.capacidade}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4" style={{ whiteSpace: 'pre-line' }}>
                                    <strong>
                                        {formatarHorarios(resp.disponibilidade).join('\n')}
                                    </strong>
                                    </td>


                                    <td className="px-6 py-4">{new Date(resp.criado_em).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <div className="inline-flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => OpenModal(resp)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => deleteResponsavel(resp.id)}
                                                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                        
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
            {openCreateModal && (
                <CreateSalaForm setOpenCreateModal={setOpenCreateModal}/>
            )}

            {openEditModal && (
                <div className="fixed inset-0 flex items-center  justify-center bg-gray-950/50 backdrop-blur-md">
                    <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden"
                            style={{ maxWidth: 900, maxHeight: 700 }}>
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 700 }}>
                        <button className="font-bold cursor-pointer" onClick={() => setOpenEditModal(false)}>X</button>
                    {errorPopup.error && (
                    <ErrorComponent
                        titulo={errorPopup.titulo}
                        desc={errorPopup.desc}
                        onClose={() => setErroPopup({ error: false, titulo: '', desc: '' })}
                    />
                    )}

                    {successPopup.success && (
                    <SucessComponent
                        titulo={successPopup.titulo}
                        desc={successPopup.desc}
                        onClose={() => setSuccessPopup({ success: false, titulo: '', desc: '' })}
                    />
                    )}
                    <h1 className="mt-4 mb-2 text-2xl font-bold">Editar Sala</h1>

                        <form onSubmit={Submit} className="flex flex-col">
                            <div className="flex w-full gap-5 flex-row">
                                <div className="w-1/2">
                                    <label htmlFor="nome">Nome da Sala</label>
                                    <input
                                        type="text"
                                        value={salaNome}
                                        placeholder="Ex: Sala 01"
                                        onChange={(e) => setSalaNome(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="capacidade">Capacidade</label>
                                    <input
                                        type="number"
                                        value={salaCapacidade}
                                        onChange={(e) => setCapacidade(Number(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                                <div className="mt-4">
                                    <label htmlFor="responsavel">Responsavel Atual (Opicional)</label>
                                        <select
                                        value={responsavelSelecionado}
                                        onChange={(e) => {
                                            const novoId = e.target.value ? Number(e.target.value) : null;
                                            setResponsavelSelecionado(novoId ?? '');
                                            setResponsavelId(novoId);
                                        }}
                                        >
                                        <option value="">Selecione um responsavel</option>
                                        {todosResponsaveisDisponiveis.map(resp => (
                                            <option key={resp.id} value={resp.id}>{resp.nome}</option>
                                        ))}
                                    </select>
                                </div>
                                <h1 className="mt-4 mb-2 text-2xl font-bold">Disponibilidade</h1>
                                {Object.entries(diasDaSemana).map(([dia , info]) => {
                                    return (
                                        <div className="mt-4" key={dia}>
                                            <div className="flex gap-2 items-center">
                                                <p className="text-xl">
                                                    <strong>{dia}</strong>
                                                </p>
                                                <input type="checkbox" 
                                                style={{width : 15, height : 15}}
                                                onChange={(e) => (
                                                    setDiasDaSemana({
                                                        ...diasDaSemana,
                                                        [dia]  : {...info , open : e.target.checked}
                                                    })
                                                )}
                                                checked={info.open} />
                                            </div>

                                            <div className="flex  flex-row gap-5">
                                                
                                                <div className="w-1/2 ml-3">
                                                    <p>Hora Inicio</p>
                                                    <input 
                                                        type="time" 
                                                        disabled={!info.open} 
                                                        value={info.init}
                                                        onChange={(e) => (
                                                            setDiasDaSemana({
                                                                ...diasDaSemana,
                                                                [dia] : {...info , init : e.target.value} 
                                                            })
                                                        )} />
                                                </div>
                                                <div className="w-1/2">
                                                    <p>Hora Fim</p>
                                                    <input type="time"
                                                        disabled={!info.open}
                                                        value={info.end}
                                                        onChange={(e) => (
                                                            setDiasDaSemana({
                                                                ...diasDaSemana,
                                                                [dia] : {...info , end : e.target.value}
                                                            })
                                                        )} />
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })}
                            <input
                                type="submit"
                                value="Enviar"
                                className="enviar"
                            />
                        </form>
                    </div>
                    </div>
                </div>
            )}
        </div>
    )
}
