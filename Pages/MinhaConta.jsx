import React from 'react';
import MinhaContaForm from '../components/account/MinhaContaForm';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MinhaConta() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Minha Conta</h1>
        <p className="mt-4 text-lg text-gray-600">
          Gerencie suas informações, endereço e segurança da sua conta.
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Perfil</CardTitle>
          <CardDescription>
            Use as abas abaixo para visualizar e editar suas informações.
          </CardDescription>
        </CardHeader>
        <MinhaContaForm />
      </Card>
    </div>
  );
}