"use client";

import React, { useState } from "react";
import Image from "next/image";


interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  property: string;
}

export default function PastoSmartAuth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    property: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("As senhas não conferem.");
        return;
      }
      // TODO: chamada de API para cadastro
      console.log("Register attempt:", formData);
      return;
    }

    // TODO: chamada de API para login
    console.log("Login attempt:", { email: formData.email, password: formData.password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Lado Esquerdo - Logo e Branding */}
          <div className="bg-white p-12 flex flex-col items-center justify-center border-r-4 border-green-600">
            <div className="mb-4">
              <div className="w-110 h-110 rounded-lg p-4 flex items-center justify-center">
                {/* Logo from public/logo.webp */}
                <Image
                  src="/logo.webp"
                  alt="Logotipo PastoSmart"
                  width={320}
                  height={320}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-lg">Pecuária inteligente</p>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-700 text-center mb-2">
                {isLogin ? "Seja bem vindo ao PastoSmart!" : "Crie sua conta no PastoSmart!"}
              </h2>
            </div>

            <div className="mb-8">
              <h3 className="text-lg text-gray-600 text-center mb-6">
                {isLogin ? "Efetue seu login" : "Preencha os dados para se cadastrar"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Formulário de Cadastro */}
                {!isLogin && (
                  <>
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nome completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="property"
                        placeholder="Nome da propriedade"
                        value={formData.property}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Campos comuns */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail ou usuário"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirmar senha apenas no cadastro */}
                {!isLogin && (
                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none transition-colors"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  {isLogin ? "Acessar" : "Cadastrar"}
                </button>
              </form>

              {/* Links de navegação */}
              <div className="mt-6 text-center">
                {isLogin ? (
                  <>
                    <p className="text-gray-600 mb-2">Esqueceu sua senha?</p>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">
                      Clique aqui
                    </button>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-600 mb-2">Ainda não tem uma conta?</p>
                      <button
                        onClick={() => {
                          setIsLogin(false);
                          setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                        }}
                        className="text-green-600 hover:text-green-700 font-bold text-lg"
                      >
                        Cadastre-se agora
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 mb-2">Já tem uma conta?</p>
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                      }}
                      className="text-green-600 hover:text-green-700 font-bold text-lg"
                    >
                      Faça login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}