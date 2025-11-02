import { useState } from "react";
import api from "../../app/api";
import '../CreateVisitantForm/CreateVisitantForm.css'
export default function CreateFeriadoForm() {
    const [data, setData] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState<number | ''>('');

    const [errorPopup, setErroPopup] = useState({ error: false, titulo: '', desc: '' });
    const [successPopup, setSuccessPopup] = useState({ success: false, titulo: '', desc: '' });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        } catch (error: any) {
            console.error(error);
            setErroPopup({ error: true, titulo: 'Erro', desc: 'Não foi possível adicionar o feriado' });
        }
    };

    return (
        <div className="flex justify-center items-center flex-col">
            <div style={{ maxWidth: 1000 }} className="w-full p-6 bg-white rounded-2xl border-solid">

                {errorPopup.error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">{errorPopup.titulo}</strong>
                        <span className="block">{errorPopup.desc}</span>
                        <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                            onClick={() => setErroPopup({ error: false, titulo: '', desc: '' })}
                        >×</span>
                    </div>
                )}

                {successPopup.success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">{successPopup.titulo}</strong>
                        <span className="block">{successPopup.desc}</span>
                        <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                            onClick={() => setSuccessPopup({ success: false, titulo: '', desc: '' })}
                        >×</span>
                    </div>
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

                        <label htmlFor="tipo">Tipo (opcional)</label>
                        <input
                            type="number"
                            value={tipo}
                            onChange={(e) => setTipo(Number(e.target.value))}
                            min={0}
                            max={10}
                        />
                    </div>

                    <input
                        type="submit"
                        value="Enviar"
                        className="enviar"
                    />
                </form>
            </div>
        </div>
    );
}
