export interface ArgType {
  /**
   * Number of processes can be executed parallelly
   */
  parallel: number
  /**
   * Relative path to the workspace config
   */
  workspace?: string
  /**
   * Array of services to install
   */
  services?: string[]
  /**
   * Enable verbose logs on console
   */
  verbose?: boolean

  /**
   * The action to execute (e.g. 'install' or 'update')
   */
  action: string
}
