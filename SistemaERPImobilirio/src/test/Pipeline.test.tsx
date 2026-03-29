import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Pipeline from '../features/pipeline/Pipeline';

describe('Pipeline Component', () => {
  it('renders pipeline columns correctly', () => {
    render(<Pipeline />);
    
    // Verify columns exist
    expect(screen.getByText('Leads (Novos)')).toBeInTheDocument();
    expect(screen.getByText('Visitas Agendadas')).toBeInTheDocument();
    expect(screen.getByText('Propostas em Análise')).toBeInTheDocument();
    expect(screen.getByText('Em Fechamento')).toBeInTheDocument();
  });

  it('renders the Nova Negociação button', () => {
    render(<Pipeline />);
    
    const button = screen.getByText('Nova Negociação');
    expect(button).toBeInTheDocument();
  });
  
  it('renders the metrics section', () => {
    render(<Pipeline />);
    
    expect(screen.getByText('Previsão de Receita')).toBeInTheDocument();
    expect(screen.getByText('Taxa de Conversão')).toBeInTheDocument();
    expect(screen.getByText('Negociações Ativas')).toBeInTheDocument();
  });

  it('opens form when clicking column add button with selected stage', () => {
    render(<Pipeline />);

    const addButtons = screen.getAllByRole('button', { name: /Adicionar/i });
    fireEvent.click(addButtons[1]);

    expect(screen.getByRole('heading', { name: 'Nova Negociação' })).toBeInTheDocument();

    const stageLabel = screen.getByText('Etapa do Funil');
    const stageSelect = stageLabel.parentElement?.querySelector('select') as HTMLSelectElement | null;
    expect(stageSelect).not.toBeNull();
    expect(stageSelect?.value).toBe('visitas');
  });
});
