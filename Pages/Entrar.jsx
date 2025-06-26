import React from 'react';
import EntrarForm from '../components/auth/EntrarForm';

export default function Entrar() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <EntrarForm />
        </div>
    );
}