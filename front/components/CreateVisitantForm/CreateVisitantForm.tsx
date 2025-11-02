import axios from "axios";
import { useState , useEffect } from "react";
import { Axios } from "axios";
import api from '../../app/api'
import './CreateVisitantForm.css'
import ErrorComponent from "../Error/ErrorComponent";
import SucessComponent from "../Sucess/SucessComponent";

export default function CreateVisitantForm(){
    const [acessoPrioritario , setAcessoPrioritario] = useState(false);
    const [descricaoPrioridade , setDescricaoPrioridade] = useState("");
    const [nivelPrioridade , setNivelPrioridade] = useState(0);
    const [errorPopup ,setErroPopup] = useState({error : false , titulo : '' , desc : ''});
    const [sucessPopup ,setSucessPopup] = useState({sucess : false , titulo : '' , desc : ''});

    const [name , setName] = useState('');
    const [document , setDocument] = useState('');
    const [phone , setPhone] = useState('');
    const [date , setDate] = useState('');

    //caso usuario cancela ser prioridade , reseta os campos se tiver prenchido
        const MudaCheckAcessoPrioritario = (value : boolean) => {
            if (value === false){
                setAcessoPrioritario(value);
                setDescricaoPrioridade('');
                setNivelPrioridade(0);
            }
        else {
            setAcessoPrioritario(value);
        }
    }
    const TemMaisDe60 = (value : string) => {
        const dataNascimento = new Date(value)
        const dataHoje = new Date()

        const idade = dataHoje.getFullYear() - dataNascimento.getFullYear();
        const mesIdade = dataHoje.getMonth() - dataNascimento.getMonth();

        const idadeFinal = mesIdade < 0 || (mesIdade === 0 && dataHoje.getDate() < dataNascimento.getDate())
        ? idade - 1 : idade;
        if (idadeFinal >= 60) {
            setAcessoPrioritario(true)
            setDescricaoPrioridade('Idoso(a)');
            setNivelPrioridade(3);
        }
    }

    const Submit = async (e : any) => {
        e.preventDefault();
        setErroPopup({
            error: false,
            titulo: '',
            desc: '',
        });
        if(acessoPrioritario && nivelPrioridade === 0){
            setErroPopup({
                error : true , 
                titulo : 'Nivel Prioridade' , 
                desc : 'informe o nivel de prioridade'
            })
            return
        }
        const data = {
            "nome" : name,
            "documento" : document,
            "phone" : phone,
            "data_nascimento" : new Date(date),
            "is_tipo_prioridade" : acessoPrioritario,
            "descricao" : acessoPrioritario ? descricaoPrioridade : null,
            "nivel_prioridade" : acessoPrioritario ? nivelPrioridade : null,
            "ativo" : true,
        }
        try {
            const res = await api.post('/visitante' , data)
            setSucessPopup({
                sucess: true,
                titulo: 'Sucesso!',
                desc: 'Usuario Criado Com Sucesso.',
            });
            //reseta todos campos 
            setName('')
            setDocument('')
            setPhone('')
            setDate('')
            setAcessoPrioritario(false)
            setDescricaoPrioridade('')
            setNivelPrioridade(0)
            return
        }catch (error : any){
            if (error.response && error.response.data) {
                const { message, error: errType } = error.response.data;
                setErroPopup({
                    error: true,
                    titulo: errType || 'Erro',
                    desc: message || 'Ocorreu um erro ao enviar.',
                });
            } else {
                setErroPopup({
                    error: true,
                    titulo: 'Erro',
                    desc: 'Não foi possível conectar ao servidor.',
                });
            }
        }

    
    }
    return(
        <div className="flex justify-center items-center flex-col ">
            <div style={{maxWidth : 1000}} className="w-full p-6 bg-white rounded-2xl border-solid">

            {errorPopup.error && (
                <ErrorComponent
                    titulo={errorPopup.titulo}
                    desc={errorPopup.desc}
                    onClose={() => setErroPopup({ error: false, titulo: '', desc: '' })}
                />
            )}
            {sucessPopup.sucess && (
                <SucessComponent
                    titulo={sucessPopup.titulo}
                    desc={sucessPopup.desc}
                    onClose={() => setSucessPopup({ sucess: false, titulo: '', desc: '' })}
                />
            )}
            <h1 className="mt-4 mb-2 text-2xl font-bold">Criar Visitante</h1>
                <form action="POST" onSubmit={(e) => Submit(e)} className="flex flex-col">
                    <div className="flex justify-around w-full flex-col">
                        <label htmlFor="nome">Nome</label>
                        <input type="text" 
                            value={name} 
                            onChange={(e) => {setName(e.target.value)}} 
                            required />
                        <label htmlFor="documento" >Documento</label>
                        <input type="text" 
                            value={document} 
                            onChange={(e) => {setDocument(e.target.value)}} 
                            required maxLength={11} minLength={11} />
                        <label htmlFor="numero">Telefone</label>
                        <input type="text" 
                            value={phone} 
                            onChange={(e) => {setPhone(e.target.value)}}                         
                            required/>
                        <label htmlFor="data_nascimento">Data Nascimento</label>
                        <input 
                            onBlur={(e) => TemMaisDe60(e.target.value)} 
                            onChange={(e) => setDate(e.target.value)}
                            value={date}
                            required type="date" />
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex items-center mt-2">
                            <label htmlFor="check">Acesso Prioritario</label>
                            <input
                            onChange={(e) => {MudaCheckAcessoPrioritario(e.target.checked)}} 
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

                    </div>
                    <input
                        type="submit"
                        value="Enviar"
                        className="enviar"
                        />

                </form>
                </div>

        </div>
        
    )
}