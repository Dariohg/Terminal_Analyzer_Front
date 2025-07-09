import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial
const initialState = {
    analysisResult: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
    lastAnalyzedFile: null,
    analysisHistory: [],
};

// Tipos de acciones
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_ANALYSIS_RESULT: 'SET_ANALYSIS_RESULT',
    SET_UPLOAD_PROGRESS: 'SET_UPLOAD_PROGRESS',
    SET_LAST_ANALYZED_FILE: 'SET_LAST_ANALYZED_FILE',
    ADD_TO_HISTORY: 'ADD_TO_HISTORY',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_STATE: 'RESET_STATE',
};

// Reducer
const analysisReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: action.payload ? null : state.error, // Clear error when starting loading
            };

        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };

        case ActionTypes.SET_ANALYSIS_RESULT:
            return {
                ...state,
                analysisResult: action.payload,
                isLoading: false,
                error: null,
                uploadProgress: 0,
            };

        case ActionTypes.SET_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.payload,
            };

        case ActionTypes.SET_LAST_ANALYZED_FILE:
            return {
                ...state,
                lastAnalyzedFile: action.payload,
            };

        case ActionTypes.ADD_TO_HISTORY:
            const newHistory = [action.payload, ...state.analysisHistory].slice(0, 10); // Keep only last 10
            return {
                ...state,
                analysisHistory: newHistory,
            };

        case ActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case ActionTypes.RESET_STATE:
            return initialState;

        default:
            return state;
    }
};

// Crear contexto
const AnalysisContext = createContext();

// Hook personalizado para usar el contexto
export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) {
        throw new Error('useAnalysis must be used within an AnalysisProvider');
    }
    return context;
};

// Provider del contexto
export const AnalysisProvider = ({ children }) => {
    const [state, dispatch] = useReducer(analysisReducer, initialState);

    // Actions
    const actions = {
        setLoading: (isLoading) => {
            dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
        },

        setError: (error) => {
            dispatch({ type: ActionTypes.SET_ERROR, payload: error });
        },

        setAnalysisResult: (result) => {
            dispatch({ type: ActionTypes.SET_ANALYSIS_RESULT, payload: result });

            // Add to history
            if (result) {
                const historyItem = {
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    filename: state.lastAnalyzedFile?.name || 'Text Analysis',
                    totalCommands: result.summary?.total_commands || 0,
                    threatCount: result.summary?.threat_count || {},
                    processingTime: result.summary?.processing_time || 0,
                };
                dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: historyItem });
            }
        },

        setUploadProgress: (progress) => {
            dispatch({ type: ActionTypes.SET_UPLOAD_PROGRESS, payload: progress });
        },

        setLastAnalyzedFile: (file) => {
            dispatch({ type: ActionTypes.SET_LAST_ANALYZED_FILE, payload: file });
        },

        clearError: () => {
            dispatch({ type: ActionTypes.CLEAR_ERROR });
        },

        resetState: () => {
            dispatch({ type: ActionTypes.RESET_STATE });
        },
    };

    // Computed values
    const computed = {
        hasResult: !!state.analysisResult,
        hasError: !!state.error,
        threatLevels: state.analysisResult?.summary?.threat_count || {},
        totalThreats: Object.values(state.analysisResult?.summary?.threat_count || {})
            .reduce((sum, count) => sum + count, 0),
        highestThreatLevel: getHighestThreatLevel(state.analysisResult?.summary?.threat_count || {}),
    };

    const value = {
        ...state,
        ...actions,
        ...computed,
    };

    return (
        <AnalysisContext.Provider value={value}>
            {children}
        </AnalysisContext.Provider>
    );
};

// Utility function to get highest threat level
function getHighestThreatLevel(threatCount) {
    const levels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'];

    for (const level of levels) {
        if (threatCount[level] > 0) {
            return level;
        }
    }

    return 'SAFE';
}

export default AnalysisContext;