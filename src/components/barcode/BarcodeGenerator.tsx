'use client'

import React, { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import { Button } from '@/components/ui'
import { Download, Printer } from 'lucide-react'

export interface BarcodeGeneratorProps {
  value: string
  format?: 'CODE128' | 'EAN13' | 'EAN8' | 'UPC'
  width?: number
  height?: number
  displayValue?: boolean
  fontSize?: number
  showActions?: boolean
}

export function BarcodeGenerator({
  value,
  format = 'EAN13',
  width = 2,
  height = 100,
  displayValue = true,
  fontSize = 20,
  showActions = true
}: BarcodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format,
          width,
          height,
          displayValue,
          fontSize,
          margin: 10
        })
      } catch (error) {
        console.error('Error generating barcode:', error)
      }
    }
  }, [value, format, width, height, displayValue, fontSize])

  const handleDownload = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const link = document.createElement('a')
      link.href = url
      link.download = `barcode-${value}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handlePrint = () => {
    if (svgRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Imprimir Código de Barras</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                }
                @media print {
                  body {
                    margin: 0;
                  }
                }
              </style>
            </head>
            <body>
              ${svgData}
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

  if (!value) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">Insira um código para gerar o código de barras</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <svg ref={svgRef}></svg>
      </div>

      {showActions && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Baixar
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
        </div>
      )}
    </div>
  )
}
