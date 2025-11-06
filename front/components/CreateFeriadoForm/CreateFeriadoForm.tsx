import { useState } from "react";
import api from "../../app/api";
import '../GenericInputs.css'
import ErrorComponent from "../Error/ErrorComponent";
import SucessComponent from "../Sucess/SucessComponent";
import BaseForm from "../BaseForm";

export default function CreateFeriadoForm() {
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState<number | ''>(0);

    const [errorPopup, setErroPopup] = useState({ error: false, titulo: '', desc: '' });
    const [successPopup, setSuccessPopup] = useState({ success: false, titulo: '', desc: '' });

    const handleSubmit = async (e : any) => {
        e.preventDefault();

        try {
            await api.post('/feriado', {
                data: new Date(data),
                descricao,
                tipo: tipo !== '' ? tipo : undefined,
                ativo : true
            });
            setSuccessPopup({ success: true, titulo: 'Sucesso!', desc: 'Feriado adicionado com sucesso' });
            setData('');
            setDescricao('');
            setTipo('');
            setTimeout(() => {
                window.location.reload();
            }, 2000)
        } catch (error: any) {
            console.error(error);
            setErroPopup({ error: true, titulo: 'Erro', desc: 'Não foi possível adicionar o feriado' });
        }
    };

    return (
        <div className="flex justify-center items-center mt-5 flex-col">
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
                <h1 className="mt-4 mb-2 text-2xl font-bold">Criar Feriado</h1>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-around w-full flex-col">
                        <label htmlFor="data">Data</label>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />

                        <label htmlFor="descricao">Descrição</label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            required
                        />

                        <label htmlFor="tipo">Tipo de Feriado 1 - Nacional, 2 - Estadual, 3 - Municipal</label>
                        <input
                            type="number"
                            value={tipo}
                            onChange={(e) => setTipo(Number(e.target.value))}
                            min={0}
                            max={3}
                        />
                    </div>

                    <input
                        type="submit"
                        value="Enviar"
                        className="enviar"
                    />
                </form>
            </BaseForm>
        </div>
    );
}
