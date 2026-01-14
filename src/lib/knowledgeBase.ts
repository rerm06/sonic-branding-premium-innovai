
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export const GLOBAL_VECTOR_STORE_ID = "ICPR-Unified-Policies-Store";

export interface KnowledgeDocument {
    id: string;
    file_name: string;
    file_type: string;
    public_url: string;
    vector_store_id: string;
    created_at: string;
}

export const uploadToKnowledgeBase = async (file: File): Promise<KnowledgeDocument | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${GLOBAL_VECTOR_STORE_ID}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('agent-docs')
            .upload(filePath, file);

        if (uploadError) {
            return {
                id: `temp-${Date.now()}`,
                file_name: file.name,
                file_type: file.type,
                public_url: "",
                vector_store_id: GLOBAL_VECTOR_STORE_ID,
                created_at: new Date().toISOString()
            };
        }

        const { data: urlData } = supabase.storage.from('agent-docs').getPublicUrl(filePath);

        const { data: insertData, error: insertError } = await supabase
            .from('knowledge_base_files')
            .insert({
                file_name: file.name,
                file_type: file.type,
                storage_path: filePath,
                public_url: urlData.publicUrl,
                vector_store_id: GLOBAL_VECTOR_STORE_ID
            })
            .select()
            .single();

        if (insertError) {
            return {
                id: `unindexed-${Date.now()}`,
                file_name: file.name,
                file_type: file.type,
                public_url: urlData.publicUrl,
                vector_store_id: GLOBAL_VECTOR_STORE_ID,
                created_at: new Date().toISOString()
            };
        }

        toast.success("Documento Vectorizado e Archivado", {
            description: `Store: ${GLOBAL_VECTOR_STORE_ID}`
        });

        return insertData as KnowledgeDocument;
    } catch (e) {
        return null;
    }
};

export const getSharedKnowledgeContext = async (): Promise<KnowledgeDocument[]> => {
    try {
        const { data, error } = await supabase
            .from('knowledge_base_files')
            .select('*')
            .eq('vector_store_id', GLOBAL_VECTOR_STORE_ID)
            .order('created_at', { ascending: false });
        if (error) return [];
        return data as KnowledgeDocument[];
    } catch (e) {
        return [];
    }
};

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string, mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: base64String,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
