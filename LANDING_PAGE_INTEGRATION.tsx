// Add this section to your MedPactRCMLanding component
// Place it after the "Innovations" section and before "Social Proof"

{/* Price Transparency Module - NEW */}
<section className="py-14">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <Card className="rounded-3xl bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-950 dark:to-emerald-950 border-2 border-cyan-200 dark:border-cyan-800">
      <CardContent className="py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">
              Advanced Price Transparency
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Navigate complex payer-provider negotiations with data-driven
              market comparisons, collaborative payment models, and automated
              contract workflows.
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                Federal Reserve & Mathematica benchmarking
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                Collaborative payment model design
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                5-stage contract negotiation workflow
              </li>
            </ul>
            <Link href="/price-transparency">
              <Button size="lg" className="rounded-2xl px-6 py-6 text-base font-bold bg-gradient-to-r from-cyan-600 to-emerald-600">
                Launch Price Transparency <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white/70 dark:bg-slate-900/70 shadow-xl">
              <h4 className="font-semibold mb-3">Workflow Stages</h4>
              <div className="space-y-2 text-sm">
                {["Data Upload", "Market Comparison", "Modeling & KPIs", "Negotiation", "Sign-off"].map((stage, idx) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-600 to-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <span>{stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</section>
