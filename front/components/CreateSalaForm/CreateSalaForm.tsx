import { useEffect, useState } from "react";
import api from "../../app/api";
import '../GenericInputs.css'
import ErrorComponent from "../Error/ErrorComponent";
import BaseForm from "../BaseForm";
import SucessComponent from "../Sucess/SucessComponent";
interface Responsavel {
    id: number
    nome: string
    documento?: string
}

interface Dia {
  open: boolean
  init: string
  end: string
}
interface DiasDaSemana {
  Segunda: Dia
  Terca?: Dia
  Quarta?: Dia
  Quinta?: Dia
  Sexta?: Dia
  Sabado?: Dia
  Domingo?: Dia
}
interface ModalFunction {
    setOpenCreateModal : (value : boolean) => void;
}
export default function CreateSalaForm({ setOpenCreateModal } : ModalFunction) {
    const handleClose = () => {
        setOpenCreateModal(false);
    };
    const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
    const [responsavelSelecionado, setResponsavelSelecionado] = useState<number | ''>('')

    const [nomeSala, setNomeSala] = useState('');
    const [capacidadeSala , setCapacidadeSala] = useState(0);
    const [varicacaoCapacidadeSala] =useState(2);

    const [diasDaSemana , setDiasDaSemana] = useState<DiasDaSemana>({
        Segunda : {open : true , init : "08:00" , end : "17:00"},
        Terca : {open : true , init : "08:00" , end : "17:00"},
        Quarta : {open : true , init : "08:00" , end : "17:00"},
        Quinta : {open : true , init : "08:00" , end : "18:00"},
        Sexta : {open : true , init : "08:00" , end : "18:00"},
        Sabado : {open : false , init : "00:00" , end : "00:00"},
        Domingo : {open : false , init : "00:00" , end : "00:00"},
    })

    const [errorPopup, setErroPopup] = useState({ error: false, titulo: '', desc: '' });
    const [successPopup, setSuccessPopup] = useState({ success: false, titulo: '', desc: '' });

    useEffect(() => {
        GetResponsaveis();
    },[])
    const GetResponsaveis = async () => {
        try {
            const response = await api.get('responsavel-sala')
            console.log(response.data.length);
            setResponsaveis(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {        
            const data = {
                "nome" : nomeSala,
                "capacidade" : capacidadeSala,
                "disponibilidade" : JSON.stringify(diasDaSemana),
                "responsavel_id" : responsavelSelecionado != 0 ? responsavelSelecionado : null,
                "ativo" : true,
            }
            await api.post('/sala', data);
            alert('Sala adicionada com sucesso');
            window.location.reload();
        }catch (error : any){
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;
                alert(message || 'Ocorreu um erro ao enviar');
            } else {
                alert('Erro de conexão');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center  justify-center bg-gray-950/50 backdrop-blur-md">
            <div   className="bg-white rounded-2xl shadow-xl w-full overflow-hidden"
                    style={{ maxWidth: 900, maxHeight: 700 }}>
                <div className="overflow-y-auto p-6" style={{ maxHeight: 700 }}>
                    <div className="flex justify-center items-center  flex-col">
                        <BaseForm>
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
                            <button className="font-bold cursor-pointer" onClick={() => setOpenCreateModal(false)}>X</button>
                            <h1 className="mt-4 mb-2 text-2xl font-bold">Criar Sala</h1>

                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <div className="flex w-full gap-5 flex-row">
                                    <div className="w-1/2">
                                        <label htmlFor="nome">Nome da Sala</label>
                                        <input
                                            type="text"
                                            value={nomeSala}
                                            placeholder="Ex: Sala 01"
                                            onChange={(e) => setNomeSala(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label htmlFor="capacidade">Capacidade</label>
                                        <input
                                            type="number"
                                            value={capacidadeSala}
                                            onChange={(e) => setCapacidadeSala(Number(e.target.value))}
                                            required
                                        />
                                    </div>
                                </div>
                                    <div className="mt-4">
                                        <label htmlFor="responsavel">Responsável Atual (Opicional)</label>
                                        <select
                                            value={responsavelSelecionado}
                                            onChange={(e) => setResponsavelSelecionado(Number(e.target.value))}
                                            
                                        >
                                            <option value="">Selecione um responsavel</option>
                                            {responsaveis.map(resp => (
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
                        </BaseForm>
                    </div>
                </div>
            </div>
            
        </div>

        
            
    );
}
