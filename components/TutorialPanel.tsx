'use client';

export default function TutorialPanel() {
  const tutorials = [
    {
      title: 'Basic Bodice',
      description: 'Learn to draft a simple bodice front and back',
      steps: [
        'Create base points for neck, shoulder, and waist',
        'Add bust and side seam points',
        'Connect points with lines and curves',
        'Add darts for fit',
        'Create the back piece',
      ],
    },
    {
      title: 'Simple Sleeve',
      description: 'Draft a basic set-in sleeve',
      steps: [
        'Measure armhole circumference',
        'Create sleeve cap height',
        'Draft sleeve cap curve',
        'Add underarm seam',
        'Adjust for ease',
      ],
    },
    {
      title: 'A-Line Skirt',
      description: 'Create a classic A-line skirt pattern',
      steps: [
        'Set waist circumference',
        'Determine skirt length',
        'Add flare for A-line shape',
        'Create waistband',
        'Add seam allowances',
      ],
    },
    {
      title: 'Straight Pants',
      description: 'Draft basic straight-leg pants',
      steps: [
        'Create front and back rise',
        'Set leg width and length',
        'Add crotch curve',
        'Shape inseam and outseam',
        'Add ease and darts',
      ],
    },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Pattern Tutorials</h3>
      
      <div className="space-y-6">
        {tutorials.map((tutorial, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-600 mb-2">{tutorial.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{tutorial.description}</p>
            
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Steps:
              </h5>
              <ol className="text-sm text-gray-600 space-y-1">
                {tutorial.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start">
                    <span className="text-blue-500 mr-2 flex-shrink-0">
                      {stepIndex + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <button className="mt-3 btn-primary text-sm">
              Start Tutorial
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Getting Started</h4>
        <p className="text-sm text-blue-700 mb-3">
          New to pattern drafting? Start with the Basic Bodice tutorial to learn the fundamentals.
        </p>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Use the point tools to create construction points</li>
          <li>• Connect points with lines and curves</li>
          <li>• Extract pieces for cutting patterns</li>
          <li>• Export patterns for printing</li>
        </ul>
      </div>
    </div>
  );
}