interface SelectedSummaryProps {
  totalCount: number;
  onContinue: () => void;
}

export function SelectedSummary({ totalCount, onContinue }: SelectedSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold">
              <span data-testid="text-selected-count">{totalCount}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Items Selected</h3>
              <p className="text-sm text-muted-foreground">Perfect for your party!</p>
            </div>
          </div>
          <button 
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg"
            onClick={onContinue}
            data-testid="button-continue"
          >
            Continue
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
