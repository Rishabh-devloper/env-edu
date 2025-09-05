'use client'

import { Certificate } from '@/types'
import { Download, Eye, Award, Calendar, Shield, Star } from 'lucide-react'
import { useState } from 'react'

interface CertificateCardProps {
  certificate: Certificate
  onDownload: (certificateId: string) => void
  onView: (certificateId: string) => void
}

export default function CertificateCard({ certificate, onDownload, onView }: CertificateCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <Award className="w-5 h-5" />
      case 'achievement':
        return <Star className="w-5 h-5" />
      case 'participation':
        return <Shield className="w-5 h-5" />
      default:
        return <Award className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'bg-green-100 text-green-800'
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800'
      case 'participation':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isExpired = certificate.validUntil && new Date(certificate.validUntil) < new Date()

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Certificate Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${getTypeColor(certificate.type)}`}>
              {getTypeIcon(certificate.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{certificate.title}</h3>
              <p className="text-sm text-gray-600">{certificate.description}</p>
            </div>
          </div>
          
          {isExpired && (
            <div className="flex items-center text-red-600 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Expired</span>
            </div>
          )}
        </div>

        {/* Certificate Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Issued: {new Date(certificate.issuedAt).toLocaleDateString()}
            </div>
            {certificate.validUntil && (
              <div className="flex items-center text-gray-500 text-sm">
                <Shield className="w-4 h-4 mr-1" />
                Valid until: {new Date(certificate.validUntil).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(certificate.type)}`}>
            {certificate.type}
          </span>
        </div>

        {/* Certificate Preview */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 mb-4 border-2 border-dashed border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">EcoLearning Certificate</h4>
            <p className="text-sm text-gray-600 mb-1">{certificate.title}</p>
            <p className="text-xs text-gray-500">Issued on {new Date(certificate.issuedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onView(certificate.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Certificate
          </button>
          
          <button
            onClick={() => onDownload(certificate.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Hover Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 pointer-events-none"></div>
      )}
    </div>
  )
}
