'use client'

import React, { useRef } from 'react'
import { BarcodeGenerator } from './BarcodeGenerator'
import { Button } from '@/components/ui'
import { Printer } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export interface EtiquetaProdutoProps {
  produto: {
    nome: string
    preco: number
    codigoBarras: string
    tamanho?: string
    marca?: string
    categoria?: string
  }
}

export function EtiquetaProduto({ produto }: EtiquetaProdutoProps) {
  const etiquetaRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (etiquetaRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const content = etiquetaRef.current.innerHTML
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Etiqueta - ${produto.nome}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                }
                .etiqueta {
                  width: 100mm;
                  padding: 10mm;
                  border: 1px solid #000;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .etiqueta {
                    border: none;
                  }
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
        }, 250)
      }
    }
  }

  return (
    <div>
      <div
        ref={etiquetaRef}
        className="etiqueta w-[100mm] border border-gray-300 rounded-lg p-4 bg-white"
      >
        {/* Header */}
        <div className="text-center mb-3 border-b border-gray-300 pb-2">
          <h3 className="font-bold text-lg">Retrô Carólis</h3>
          <p className="text-xs text-gray-600">Moda Sustentável</p>
        </div>

        {/* Product Info */}
        <div className="mb-3">
          <h2 className="font-bold text-base mb-2 line-clamp-2">{produto.nome}</h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
            {produto.marca && (
              <div>
                <span className="font-semibold">Marca:</span> {produto.marca}
              </div>
            )}
            {produto.tamanho && (
              <div>
                <span className="font-semibold">Tamanho:</span> {produto.tamanho}
              </div>
            )}
            {produto.categoria && (
              <div className="col-span-2">
                <span className="font-semibold">Categoria:</span> {produto.categoria}
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="text-center mb-3 py-2 bg-gray-50 rounded">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(produto.preco)}</p>
        </div>

        {/* Barcode */}
        <div className="flex justify-center">
          <BarcodeGenerator
            value={produto.codigoBarras}
            format="EAN13"
            width={1.5}
            height={60}
            fontSize={12}
            showActions={false}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-3 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            Troca em até 7 dias • www.retrocarolis.com
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-4 text-center">
        <Button
          variant="primary"
          icon={<Printer className="w-5 h-5" />}
          onClick={handlePrint}
        >
          Imprimir Etiqueta
        </Button>
      </div>
    </div>
  )
}
