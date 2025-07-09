import React, { useState, useRef } from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import { analysisService, apiUtils } from '../../services/api';
import {
    CloudArrowUpIcon,
    DocumentIcon,
    XMarkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const FileUpload = () => {
    const {
        setLoading,
        setAnalysisResult,
        setError,
        setUploadProgress,
        setLastAnalyzedFile,
        uploadProgress
    } = useAnalysis();

    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        try {
            apiUtils.validateFile(file);
            setSelectedFile(file);
            setError(null);
        } catch (error) {
            setError(error.message);
            setSelectedFile(null);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setLoading(true);
        setUploadProgress(0);

        try {
            const result = await analysisService.uploadFile(
                selectedFile,
                (progress) => setUploadProgress(progress)
            );

            setAnalysisResult(result);
            setLastAnalyzedFile(selectedFile);
            setSelectedFile(null);

            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            setError(error.message || 'Error al subir el archivo');
        } finally {
            setIsUploading(false);
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* File Input Area */}
            <div
                className={`upload-area ${dragActive ? 'dragover' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept=".history,.bash_history,.zsh_history,.fish_history,.txt"
                />

                <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                    Arrastra tu archivo aquí
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                    Archivos soportados: .bash_history, .zsh_history, .history, .txt (máx. 10MB)
                </p>
            </div>

            {/* Selected File Display */}
            {selectedFile && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <DocumentIcon className="h-8 w-8 text-primary-600" />
                            <div>
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-600">
                                    {apiUtils.formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={removeSelectedFile}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            disabled={isUploading}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && uploadProgress > 0 && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Subiendo...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Upload Button */}
                    {!isUploading && (
                        <div className="mt-4">
                            <button
                                onClick={handleUpload}
                                className="btn-primary w-full"
                            >
                                <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                                Analizar Archivo
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* File Validation Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Consejos para mejores resultados
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Usa archivos de historial reales de bash, zsh o fish</li>
                    <li>• Los archivos más grandes proporcionan análisis más completos</li>
                    <li>• Asegúrate de que el archivo contenga comandos de shell válidos</li>
                    <li>• Los comentarios y líneas vacías se ignorarán automáticamente</li>
                </ul>
            </div>

            {/* Common History File Locations */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                    Ubicaciones comunes de archivos de historial:
                </h4>
                <div className="text-sm text-gray-700 space-y-1 font-mono">
                    <div>~/.bash_history</div>
                    <div>~/.zsh_history</div>
                    <div>~/.history</div>
                    <div>~/.local/share/fish/fish_history</div>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;