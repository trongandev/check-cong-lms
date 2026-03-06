import configService from "@/services/configService"
import { ConfigRequest, LinkSheetRequest } from "@/types/type"
import { createContext, useContext, useEffect, useState } from "react"

const TokenStorage = {
    saveConfig: (config: ConfigRequest) => {
        sessionStorage.setItem("app_config", JSON.stringify(config))
    },
    getConfig: (): ConfigRequest | null => {
        const configString = sessionStorage.getItem("app_config")
        return configString ? JSON.parse(configString) : null
    },
    removeConfig: () => {
        sessionStorage.removeItem("app_config")
    },
    updateConfig: (configData: Partial<ConfigRequest>) => {
        const currentConfig = TokenStorage.getConfig() || {}
        const updatedNewConfig: any = { ...currentConfig, ...configData }
        TokenStorage.saveConfig(updatedNewConfig)
        return updatedNewConfig
    },
}

interface ConfigContextType {
    configData: ConfigRequest
    currentConfig: LinkSheetRequest | null
    getConfig: () => Promise<ConfigRequest | null>
    updateConfig: (configData: Partial<ConfigRequest>) => Promise<ConfigRequest | null>
    createConfig: (configData: Partial<ConfigRequest>) => Promise<ConfigRequest | null>
    deleteLinkSheet: (_id: string) => Promise<void>
}
const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [configState, setConfigState] = useState<ConfigRequest>({
        version: "default",
        linkSheet: [],
        posLinkSheetToSplit: 0,
        paramEndLinkSheet: "",
    })

    useEffect(() => {
        const fetchConfig = async () => {
            const savedConfig = TokenStorage.getConfig()
            if (savedConfig) {
                setConfigState(savedConfig)
            } else {
                const req = await configService.getConfigDefault()
                TokenStorage.saveConfig(req)
                setConfigState(req)
            }
        }
        fetchConfig()
    }, [])
    const contextValue: ConfigContextType = {
        ...configState,
        currentConfig: configState?.linkSheet[configState?.linkSheet?.length - 1] || null,
        configData: configState,
        getConfig: async () => {
            return configState
        },
        updateConfig: async (configData: Partial<ConfigRequest>) => {
            // Implement API call to update config
            const updatedConfig = { ...configState, ...configData }
            setConfigState(updatedConfig)
            return updatedConfig
        },
        createConfig: async (configData: Partial<ConfigRequest>) => {
            // Implement API call to create config
            const newConfig = { ...configState, ...configData }
            setConfigState(newConfig)
            return newConfig
        },
        deleteLinkSheet: async (_id: string) => {
            // Implement API call to delete link sheet
            const updatedLinkSheets = configState.linkSheet.filter((sheet) => sheet._id !== _id)
            const updatedConfig = { ...configState, linkSheet: updatedLinkSheets }
            setConfigState(updatedConfig)
        },
    }

    return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>
}

export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider")
    }
    return context
}

// Export TokenStorage để sử dụng trong axios interceptor
