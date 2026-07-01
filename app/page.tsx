"use client";

import Image from "next/image";
import { SubmitEvent, useEffect, useState } from "react";
import io from "socket.io-client";
import { PaperclipIcon } from "lucide-react";

// Define a interface Message para tipar as mensagens recebidas do servidor
interface Message {
  message: string;
  url?: string;
  author: string;
  date: string;

}

export default function Home() {
  

  const [messages, setMessages] = useState([] as Message[]);
  const [author, setAuthor] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    socket.on("connect", () => {
      socket.on("message", (data: Message) => {
        setMessages((oldState) => [...oldState, data]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []); 
  function handleSubmit(e: SubmitEvent) { // Função para enviar mensagem
    e.preventDefault();// Previne o comportamento padrão do formulário, que é recarregar a página
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {// Envia a mensagem para o servidor usando fetch
      method: "POST", // Metodo de requisição POST para enviar dados ao servidor
      headers: { // Adiciona cabeçalho para definir o tipo de conteúdo como JSON
        "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
      },
      body: JSON.stringify({ // Converte os dados para JSON antes de enviar
        message: newMessage, // Envia a mensagem digitada
        author, // Envia o autor da mensagem
        date: new Date().toISOString(), // Envia a data atual no formato ISO 8601
      }),
    })
      .catch(() => alert("Erro ao enviar a mensagem")) // Exibe um alerta em caso de erro ao enviar a mensagem
      .finally(() => setNewMessage("")); // Limpa o campo de mensagem após o envio
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {  // Função para enviar imagem
    const file = e.target.files?.[0]; // Pega o primeiro arquivo selecionado
    if (!file) {  // Se não encontrar nenhum arquivo, exibe uma mensagem de erro
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("author", author);
    formData.append("date", new Date().toISOString());

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
      method: "POST",
      body: formData,
    })
      .catch(() => alert("Erro ao enviar a imagem"))
  }

  return (
    <main className="w-screen h-screen bg-black text-white">
      <div className="h-[5%]">
        <input
          className="w-full text-center"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <hr className="opacity-50" />
      </div>

      <div className="h-[90%] overflow-y-auto flex flex-col px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-xl w-fit p-4 mt-2 ${author === message.author ? "self-end bg-green-900/50" : "self-start bg-gray-900"}`}
          >
            {author !== message.author && (
              <p className="font-bold text-sm text-green-900">
                {message.author}
              </p>
            )}

            {message.url ? (
              <Image
               src={message.url}
                alt="Imagem Recebida"
                 width={300}
                  height={200}
                  unoptimized
                  />
                 ) : ( 
                 <p>{message.message}</p>
                 )}

            <p className="text-sm text-gray-500">
              {new Date(message.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
      </div>

      <div className="h-[5%]">
        <hr className="opacity-50" />
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            className="w-full"
            placeholder="Digite sua mensagem"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          
          <div>
            <label htmlFor="image" className="cursor-pointer rounded-full">
              <PaperclipIcon size={20} />
            </label>

            <input type="file"
              id="image"
              accept="image/*"
              hidden
              />
          </div>

        </form>
      </div>
    </main>
  );
}